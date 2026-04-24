from django.utils import timezone
from rest_framework import generics, status,permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from apps.fields.filters import FieldFilter
from apps.fields.models import Field, FieldAssignment, FieldObservation
from apps.fields.serializers import FieldAssignmentSerializer, FieldCreateUpdateSerializer, FieldDetailSerializer, FieldListSerializer, FieldObservationSerializer, FieldObservationUpdateSerializer
from apps.fields.services.field_observation import FieldObservationService
from apps.fields.services.overview_service import DashboardService
from apps.fields.services.rolePermission import require_role
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView


class FieldCreateAPIView(generics.CreateAPIView):
    serializer_class = FieldCreateUpdateSerializer

    def create(self, request, *args, **kwargs):
        require_role(request.user, ["ADMIN"])
        
        name = request.data.get("name")
        crop_type = request.data.get("crop_type")

       
        if Field.objects.filter(name=name, crop_type=crop_type).exists():
            return Response(
                {
                    "success": False,
                    "message": "A field with this name and crop type already exists.",
                    "errors": {
                        "name": ["Duplicate field for this crop type."]
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        field = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Field created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class FieldListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FieldListSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = FieldFilter

    def get_queryset(self):
        user = self.request.user
        base_queryset = Field.objects.prefetch_related(
            "assignments__agent"  
        )
        if user.role == "ADMIN":
            return base_queryset.order_by("-created_at")
        return (
            base_queryset
            .filter(assignments__agent=user)
            .distinct()
            .order_by("-created_at")
        )
        
    
class FieldRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "pk"

    queryset = Field.objects.prefetch_related(
        "assignments__agent",
        "observations__agent"
    )

    def get_object(self):
        obj = super().get_object()
        user = self.request.user

       
        if user.role == "ADMIN":
            return obj

        if not obj.assignments.filter(agent=user).exists():
            raise PermissionDenied("You are not assigned to this field.")

        return obj

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return FieldCreateUpdateSerializer
        return FieldDetailSerializer
    
    
class FieldAssignmentCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FieldAssignmentSerializer

    def create(self, request, *args, **kwargs):
        field_id = request.data.get("field")
        agent_id = request.data.get("agent")

        # if already assigned, replace the existing assignment
        existing = FieldAssignment.objects.filter(field_id=field_id).first()
        if existing:
            existing.agent_id = agent_id
            existing.assigned_at = timezone.now()
            existing.save(update_fields=["agent_id", "assigned_at"])
            return Response(
                {
                    "success": True,
                    "message": "Field reassigned successfully.",
                    "data": FieldAssignmentSerializer(existing).data,
                },
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Agent assigned successfully.",
                "data": FieldAssignmentSerializer(assignment).data,
            },
            status=status.HTTP_201_CREATED,
        )
        
class FieldAssignmentListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FieldAssignmentSerializer

    def get_queryset(self):
        return FieldAssignment.objects.select_related("field", "agent")
    
    
    
# metrics
class DashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        base_response = {
            "overview": DashboardService.overview(user),
            "field_stage_distribution": DashboardService.field_stage_distribution(user),
            "field_risk_distribution": DashboardService.field_risk_distribution(user),
            "observation_trend": DashboardService.observation_trend(user),
        }

     
        # ADMIN DASHBOARD
     
        if user.role == "ADMIN":
            base_response.update({
                "agent_performance": DashboardService.agent_performance(),
            })
            return Response(base_response)

     
        # AGENT DASHBOARD
     
        base_response.update({
            "agent_dashboard": DashboardService.agent_dashboard(user),
        })

        return Response(base_response)
        
        


class FieldObservationCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FieldObservationSerializer

    def create(self, request, *args, **kwargs):
        user = request.user

        field_id = request.data.get("field")
        stage = request.data.get("stage")
        notes = request.data.get("notes", "")

        try:
            field = Field.objects.get(id=field_id)
        except Field.DoesNotExist:
            return Response(
                {"success": False, "error": "Field not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            observation = FieldObservationService.record_observation(
                field=field,
                agent=user,
                stage=stage,
                notes=notes
            )
        except PermissionDenied as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_403_FORBIDDEN
            )
        except ValueError as e:
            return Response(
                {"success": False, "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "success": True,
                "message": "Observation recorded successfully.",
                "data": FieldObservationSerializer(observation).data,
            },
            status=status.HTTP_201_CREATED
        )   
        
class FieldObservationUpdateAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FieldObservationUpdateSerializer
    lookup_field = "pk"

    def get_queryset(self):
        user = self.request.user

        if user.role == "ADMIN":
            return FieldObservation.objects.all()

        return FieldObservation.objects.filter(agent=user)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True 
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Observation updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK
        )