from django.utils import timezone
from django.db import models

from apps.core.models import AbstractBaseModel

ACTIVE = "ACTIVE"
AT_RISK = "AT_RISK"
COMPLETED = "COMPLETED"

class Field(AbstractBaseModel):
    STAGE_CHOICES = [
        ("PLANTED", "Planted"),
        ("GROWING", "Growing"),
        ("READY", "Ready"),
        ("HARVESTED", "Harvested"),
    ]
    STATUS_CHOICES = [
        (ACTIVE, "Active"),
        (AT_RISK, "At Risk"),
        (COMPLETED, "Completed"),
    ]
    name = models.CharField(max_length=255)
    crop_type = models.CharField(max_length=255)
    planting_date = models.DateField()
    current_stage = models.CharField(max_length=20, choices=STAGE_CHOICES)
    threshold_days = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Days after planting before a non-READY field is considered AT_RISK. Defaults to 90 if not set."
    )
    from django.utils import timezone

    @property
    def status(self):
        if self.current_stage == "HARVESTED":
            return self.COMPLETED

        days_since_planting = max(
            (timezone.now().date() - self.planting_date).days,
            0
        )

        effective_threshold = self.threshold_days if self.threshold_days is not None else 90

        if days_since_planting > effective_threshold and self.current_stage in ["PLANTED", "GROWING"]:
            return self.AT_RISK

        return self.ACTIVE
    
    def __str__(self):
        return self.name
    
    
class FieldAssignment(AbstractBaseModel):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name="assignments")
    agent = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="assigned_fields")
    assigned_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("field", "agent")

    def __str__(self):
        return f"{self.field.name} -> {self.agent.first_name}"
    


class FieldObservation(AbstractBaseModel):
    """
    An append-only log of stage changes and notes recorded by a field agent.
    Captures the full history of a field's progression over the season.
    """
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name="observations")
    agent = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="field_observations")
    stage = models.CharField(max_length=20, choices=Field.STAGE_CHOICES)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Observation for {self.field.name} by {self.agent.first_name}"