from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from apps.users.filters import UserFilter
from apps.users.models import User
from apps.users.serializers import LoginSerializer, UserCreateUpdateSerializer, UserListSerializer, UserSerializer, LogoutSerializer
from rest_framework_simplejwt.exceptions import TokenError, AuthenticationFailed
from rest_framework.exceptions import ValidationError
from rest_framework import generics, status, permissions
from django_filters.rest_framework import DjangoFilterBackend

class LoginView(TokenObtainPairView):
    permission_classes = []
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except (AuthenticationFailed, ValidationError):
            return Response(
                {
                    "success": False,
                    "message": "Invalid email or password.",
                    "errors": None,
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            token.blacklist()

            return Response(
                {
                    "success": True,
                    "message": "Logged out successfully.",
                    "data": None,
                },
                status=status.HTTP_200_OK,
            )

        except TokenError:
            return Response(
                {
                    "success": False,
                    "message": "Invalid or expired token.",
                    "errors": None,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    
    
class UserCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserCreateUpdateSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get("email")

       
        if User.objects.filter(email=email).exists():
            return Response(
                {
                    "success": False,
                    "message": "A user with this email already exists.",
                    "errors": {"email": ["This email is already taken."]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "success": True,
                "message": "User created successfully.",
                "data": UserCreateUpdateSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )
        
class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    lookup_field = "pk"
    serializer_class = UserCreateUpdateSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        email = request.data.get("email")

        
        if email and User.objects.filter(email=email).exclude(pk=instance.pk).exists():
            return Response(
                {
                    "success": False,
                    "message": "A user with this email already exists.",
                    "errors":  "This email is already taken.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "success": True,
                "message": "User updated successfully.",
                "data": UserCreateUpdateSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )
        
class UserListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserListSerializer

    def get_queryset(self):
        return User.objects.prefetch_related("assigned_fields__field").all()
    
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter