from django.urls import path
from apps.fields.views import (
    DashboardAPIView,
    FieldCreateAPIView,
    FieldListAPIView,
    FieldObservationCreateAPIView,
    FieldObservationUpdateAPIView,
    FieldRetrieveUpdateDestroyAPIView,
    FieldAssignmentCreateAPIView,
    FieldAssignmentListAPIView,
)

urlpatterns = [
    # Fields
    path("", FieldListAPIView.as_view()),
    path("create/", FieldCreateAPIView.as_view()),
    path("<int:pk>/", FieldRetrieveUpdateDestroyAPIView.as_view()),

    # Assignments
    path("assign/", FieldAssignmentCreateAPIView.as_view()),
    path("assignments/", FieldAssignmentListAPIView.as_view()),
    
    # Observation
    path(
        "observations/create/",
        FieldObservationCreateAPIView.as_view(),
        name="field-observation-create"
    ),
     path(
        "observations/<int:pk>/",
        FieldObservationUpdateAPIView.as_view(),
        name="field-observation-update"
    ),
     
    #  Overview
    path("dashboard-overview/", DashboardAPIView.as_view(), name="dashboard-overview"),
]