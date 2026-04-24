import django_filters
from apps.fields.models import Field


class FieldFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr="icontains")
    crop_type = django_filters.CharFilter(lookup_expr="icontains")
    stage = django_filters.CharFilter(field_name="current_stage", lookup_expr="iexact")
    status = django_filters.CharFilter(method="filter_status")
    date_from = django_filters.DateFilter(field_name="planting_date", lookup_expr="gte")
    date_to = django_filters.DateFilter(field_name="planting_date", lookup_expr="lte")

    class Meta:
        model = Field
        fields = ["name", "crop_type", "current_stage"]

    def filter_status(self, queryset, name, value):
        if value.upper() == "ACTIVE":
            return queryset.exclude(current_stage="HARVESTED")
        if value.upper() == "COMPLETED":
            return queryset.filter(current_stage="HARVESTED")
        return queryset