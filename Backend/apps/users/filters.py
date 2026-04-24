import django_filters
from apps.users.models import User


class UserFilter(django_filters.FilterSet):
    role = django_filters.CharFilter(field_name="role", lookup_expr="iexact")
    email = django_filters.CharFilter(field_name="email", lookup_expr="icontains")
    name = django_filters.CharFilter(method="filter_name")

    class Meta:
        model = User
        fields = ["role", "email"]

    def filter_name(self, queryset, name, value):
        return queryset.filter(
            first_name__icontains=value
        ) | queryset.filter(last_name__icontains=value)