from rest_framework import serializers
from apps.fields.models import Field, FieldAssignment, FieldObservation


class FieldCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = [
            "id",
            "name",
            "crop_type",
            "planting_date",
            "current_stage",
            "threshold_days",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "threshold_days": {"required": False, "allow_null": True},
            
        }

class FieldListSerializer(serializers.ModelSerializer):
    status = serializers.ReadOnlyField()
    assigned_agent = serializers.SerializerMethodField()
    class Meta:
        model = Field
        fields = [
            "id",
            "name",
            "crop_type",
            "current_stage",
            "status",
            "threshold_days",
            "assigned_agent",
            "planting_date",
        ]
    def get_assigned_agent(self, obj):
        assignment = obj.assignments.select_related("agent").first()
        if not assignment:
            return None
        return {
            "id": assignment.agent.id,
            "first_name": assignment.agent.first_name,
            "last_name": assignment.agent.last_name,
            "email": assignment.agent.email,
        }
        

class FieldDetailSerializer(serializers.ModelSerializer):
    status = serializers.ReadOnlyField()
    assignments = serializers.SerializerMethodField()
    observations = serializers.SerializerMethodField()
    assignment_count = serializers.SerializerMethodField()
    observation_count = serializers.SerializerMethodField()

    class Meta:
        model = Field
        fields = [
            "id",
            "name",
            "crop_type",
            "planting_date",
            "current_stage",
            "threshold_days",
            "status",

           
            "assignments",
            "assignment_count",
            "observations",
            "observation_count",
        ]

   
    # ASSIGNMENTS
  
    def get_assignments(self, obj):
        return [
            {
                "id": a.id,
                "agent_id": a.agent.id,
                "agent_name": f"{a.agent.first_name} {a.agent.last_name}",
                "agent_email": a.agent.email,
                "assigned_at": a.assigned_at,
            }
            for a in obj.assignments.select_related("agent")
        ]

    def get_assignment_count(self, obj):
        return obj.assignments.count()

    # OBSERVATIONS
    def get_observations(self, obj):
        return [
            {
                "id": o.id,
                "agent_id": o.agent.id,
                "agent_name": f"{o.agent.first_name} {o.agent.last_name}",
                "stage": o.stage,
                "notes": o.notes,
                "created_at": o.created_at,
            }
            for o in obj.observations.select_related("agent").order_by("-created_at")[:20]
        ]

    def get_observation_count(self, obj):
        return obj.observations.count()    
        
class FieldAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldAssignment
        fields = [
            "id",
            "field",
            "agent",
            "assigned_at",
        ]
        read_only_fields = ["id", "assigned_at"]
        
        
        

class FieldObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldObservation
        fields = [
            "id",
            "field",
            "agent",
            "stage",
            "notes",
            "created_at"
        ]
        read_only_fields = ["id", "agent", "created_at"]
        
class FieldObservationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldObservation
        fields = ["notes", "stage"]
        
class AgentPerformanceSerializer(serializers.Serializer):
    agent_id = serializers.IntegerField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    total_fields = serializers.IntegerField()
    total_observations = serializers.IntegerField()
    completed_fields = serializers.IntegerField()

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    
class RecentObservationSerializer(serializers.Serializer):
    field_id = serializers.IntegerField()
    field_name = serializers.CharField()
    crop_type = serializers.CharField()

    stage = serializers.CharField()
    notes = serializers.CharField(allow_blank=True)
    created_at = serializers.DateTimeField()