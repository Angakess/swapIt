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


class UserState(models.Model):
    name = models.CharField(max_length=255, null=False)

    def __str__(self):
        return self.name


class UserAccountManager(BaseUserManager):
    def create_user(self, dni, password, **extra_fields):
        if not dni:
            raise ValueError('Users must have an dni address')
        user = self.model(dni=dni, **extra_fields)
        user.set_password(password)
        state = UserState.objects.get(id=4)
        user.state = state
        user.save()
        return user

    def create_superuser(self, dni, password, **extra_fields):
        user = self.create_user(dni, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        state = UserState.objects.get(id=3)
        user.state = state
        user.save()

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=False)
    dni = models.CharField(max_length=8, unique=True, null=False)
    email = models.EmailField(max_length=255, unique=True, null=False)
    date_of_birth = models.DateField(null=False, blank=True)
    phone_number = models.CharField(max_length=30, null=False)

    id_subsidiary = models.ForeignKey(
        Subsidiary, blank=True, null=True, on_delete=models.DO_NOTHING
    )

    failed_login_attempts = models.IntegerField(default=0)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    state = models.ForeignKey(UserState, on_delete=models.DO_NOTHING,
                              related_name="users")
    gender = models.CharField(max_length=6, choices=Gender.choices, null=False)
    role = models.CharField(
        max_length=10, choices=Role.choices, default=Role.EXCHANGER,
        null=False)

    # TODO: ADD STATE USER

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
    user = models.OneToOneField(
        UserAccount, on_delete=models.CASCADE, related_name='user_register')

    def __str__(self):
        return f"Code: {self.code}, User: {self.user.dni}"
