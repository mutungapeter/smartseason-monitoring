from django.urls import path
from apps.users.views import LoginView, LogoutView, MeView, UserCreateView, UserListAPIView, UserRetrieveUpdateDestroyView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", MeView.as_view(), name="me"),
    
    # manage users(Agents, Admins)
    path("create/", UserCreateView.as_view(), name="user-create"),
    path("", UserListAPIView.as_view(), name="user-list"),
    path("<int:pk>/", UserRetrieveUpdateDestroyView.as_view(), name="user-detail"),
]