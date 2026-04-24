from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from apps.fields.models import Field, FieldObservation


class FieldObservationService:
    """
    Handles recording a field agent's observation and advancing the field's stage.
    Both operations are atomic — either both succeed or neither is committed.
    """

    VALID_STAGE_PROGRESSION = {
        "PLANTED": "GROWING",
        "GROWING": "READY",
        "READY": "HARVESTED",
    }

    @classmethod
    def record_observation(cls, *, field: Field, agent, stage: str, notes: str = "") -> FieldObservation:
        cls._validate_agent_assignment(field, agent)
        cls._validate_stage_progression(field, stage)

        with transaction.atomic():
            observation = FieldObservation.objects.create(
                field=field,
                agent=agent,
                stage=stage,
                notes=notes,
            )

            field.current_stage = stage
            field.save(update_fields=["current_stage", "updated_at"])

        return observation

    @classmethod
    def _validate_agent_assignment(cls, field: Field, agent):
        is_assigned = field.assignments.filter(agent=agent).exists()
        if not is_assigned:
            raise PermissionDenied("You are not assigned to this field.")

    @classmethod
    def _validate_stage_progression(cls, field: Field, new_stage: str):
        if field.current_stage == "HARVESTED":
            raise ValueError("This field has already been harvested.")

        expected_next = cls.VALID_STAGE_PROGRESSION.get(field.current_stage)
        if new_stage != expected_next:
            raise ValueError(
                f"Invalid stage progression. Expected '{expected_next}', got '{new_stage}'."
            )