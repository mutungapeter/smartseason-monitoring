from django.db import models

from django.contrib.auth.models import AbstractUser, BaseUserManager

from apps.core.models import AbstractBaseModel

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)
    
    
class User(AbstractBaseModel, AbstractUser):
    ADMIN = "ADMIN"
    AGENT = "AGENT"

    ROLE_CHOICES = [
        (ADMIN, "Admin"),
        (AGENT, "Field Agent"),
    ]

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    username = None 

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "role"]
    objects = CustomUserManager()
    def __str__(self):
        return f"{self.first_name} {self.last_name}"