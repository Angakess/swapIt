from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin,
                                        BaseUserManager)
from subsidiary.models import Subsidiary

class Role(models.TextChoices):
    ADMIN = 'ADMIN'
    HELPER = 'HELPER'
    EXCHANGER = 'EXCHANGER'

class Gender(models.TextChoices):
    """Sex options."""
    MALE = 'MALE'
    FEMALE = 'FEMALE'
    OTHER = 'OTHER'

class UserAccountManager(BaseUserManager):
    def create_user(self, dni, password, **extra_fields):
        if not dni:
            raise ValueError('Users must have an dni address')
        user = self.model(dni=dni, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, dni, password, **extra_fields):
        user = self.create_user(dni, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.save()

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    dni = models.CharField(max_length=40, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    gender = models.CharField(max_length=6, choices=Gender.choices)
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=30)

    id_subsidiary = models.ForeignKey(
        Subsidiary, blank=True, null=True, on_delete=models.DO_NOTHING)

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.EXCHANGER)
    objects = UserAccountManager()

    USERNAME_FIELD = 'dni'
    REQUIRED_FIELDS = [
        'first_name', 'last_name', 'email', 'date_of_birth', 'phone_number',
        'gender'
    ]

    def __str__(self):
        return self.dni

    class Meta:
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'

class UserRegister(models.Model):
    code = models.CharField(max_length=255)
    user = models.OneToOneField(UserAccount, on_delete=models.CASCADE, related_name='user_register')

    def __str__(self):
        return f"Code: {self.code}, User: {self.user.dni}"

