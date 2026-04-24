from datetime import timedelta
from django.db.models import Count
from django.utils import timezone
from django.db.models import Q
from apps.fields.models import Field, FieldAssignment, FieldObservation
from apps.fields.serializers import AgentPerformanceSerializer, RecentObservationSerializer


class DashboardService:

    
    # CORE RISK LOGIC (REUSABLE)
    
    @staticmethod
    def is_field_at_risk(field, today):
        """
        Central rule:
        - Only PLANTED / GROWING can be at risk
        - Risk depends on field-specific threshold_days
        """
        age = (today - field.planting_date).days
        threshold = field.threshold_days or 90

        return (
            field.current_stage in ["PLANTED", "GROWING"]
            and age > threshold
        )

    
    # OVERVIEW METRICS
    
    @staticmethod
    def overview(user):
        qs = Field.objects.all() if user.role == "ADMIN" else Field.objects.filter(
            assignments__agent=user
        )

        qs = qs.distinct()
        today = timezone.now().date()

        total = qs.count()
        completed = qs.filter(current_stage="HARVESTED").count()

        at_risk = sum(
            1 for f in qs if DashboardService.is_field_at_risk(f, today)
        )

        active = total - completed

        return {
            "total_fields": total,
            "active_fields": active,
            "completed_fields": completed,
            "at_risk_fields": at_risk,
        }

    
    # FIELD STAGE DISTRIBUTION (PIE CHART)
    
    @staticmethod
    def field_stage_distribution(user):
        qs = Field.objects.all() if user.role == "ADMIN" else Field.objects.filter(
            assignments__agent=user
        )

        qs = qs.distinct()

        return list(
            qs.values("current_stage").annotate(
                count=Count("id")
            )
        )

    
    # FIELD RISK + AGE DISTRIBUTION (AREA CHART)
    
    @staticmethod
    def field_risk_distribution(user):
        qs = Field.objects.all() if user.role == "ADMIN" else Field.objects.filter(
            assignments__agent=user
        )

        qs = qs.distinct()
        today = timezone.now().date()

        buckets = {
            "safe": 0,
            "warning": 0,
            "at_risk": 0,
        }

        for field in qs:
            age = (today - field.planting_date).days
            threshold = field.threshold_days or 90

            if field.current_stage == "HARVESTED":
                buckets["safe"] += 1
            elif field.current_stage not in ["PLANTED", "GROWING"]:
                # READY (and any future stages) are safe — not candidates for risk
                buckets["safe"] += 1
            elif age > threshold:
                buckets["at_risk"] += 1
            elif age > (threshold * 0.7):
                buckets["warning"] += 1
            else:
                buckets["safe"] += 1

        return buckets

    
    # OBSERVATION ACTIVITY TREND (LINE / AREA CHART)
    
    @staticmethod
    def observation_trend(user):
        qs = FieldObservation.objects.all()

        if user.role != "ADMIN":
            qs = qs.filter(agent=user)

        today = timezone.now().date()
        data = []

        for i in range(6):
            start = today - timedelta(days=7 * (i + 1))
            end = today - timedelta(days=7 * i)

            data.append({
                "period": start.strftime("%Y-%W"),
                "observations": qs.filter(
                    created_at__date__gte=start,
                    created_at__date__lt=end
                ).count()
            })

        return list(reversed(data))

    
    # AGENT PERFORMANCE SCORING
    @staticmethod
    def agent_performance():
        qs = FieldAssignment.objects.values(
            "agent_id",
            "agent__first_name",
            "agent__last_name",
        ).annotate(
            total_fields=Count("field", distinct=True),
            total_observations=Count("agent__field_observations", distinct=True),
            completed_fields=Count(
                "field",
                filter=Q(field__current_stage="HARVESTED"),
                distinct=True
            ),
        )

        # normalize
        normalized = [
            {
                "agent_id": item["agent_id"],
                "first_name": item["agent__first_name"],
                "last_name": item["agent__last_name"],
                "total_fields": item["total_fields"],
                "total_observations": item["total_observations"],
                "completed_fields": item["completed_fields"],
            }
            for item in qs
        ]

        return AgentPerformanceSerializer(normalized, many=True).data

    
    # AGENT DASHBOARD
    @staticmethod
    def agent_dashboard(user):
        fields = Field.objects.filter(assignments__agent=user).distinct()
        observations = FieldObservation.objects.filter(agent=user)

        today = timezone.now().date()

        def is_at_risk(field):
            age = (today - field.planting_date).days
            threshold = field.threshold_days or 90
            return field.current_stage in ["PLANTED", "GROWING"] and age > threshold

        recent_qs = observations.select_related("field").order_by("-created_at")[:5]

        recent_data = [
            {
                "field_id": o.field.id,
                "field_name": o.field.name,
                "crop_type": o.field.crop_type,   
                "stage": o.stage,
                "notes": o.notes,
                "created_at": o.created_at,
            }
            for o in recent_qs
        ]

        return {
            "assigned_fields": fields.count(),

            "status_breakdown": {
                "active": fields.exclude(current_stage="HARVESTED").count(),
                "completed": fields.filter(current_stage="HARVESTED").count(),
                "at_risk": sum(1 for f in fields if is_at_risk(f)),
            },

            "field_risk_distribution": DashboardService.field_risk_distribution(user),

            "my_observations": observations.count(),

        
            "recent_observations": RecentObservationSerializer(recent_data, many=True).data,
        }