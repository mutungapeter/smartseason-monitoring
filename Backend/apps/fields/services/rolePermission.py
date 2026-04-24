from rest_framework.exceptions import PermissionDenied


def require_role(user, allowed_roles: list):
    """
    Pure role-based guard.
    Assumes user is already authenticated via DRF permissions.
    """

    if user.role not in allowed_roles:
        raise PermissionDenied(
            f"You do not have permission to perform this action. Required roles: {allowed_roles}"
        )