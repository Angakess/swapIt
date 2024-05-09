from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin,
                                        BaseUserManager)
from subsidiary.models import Subsidiary


class UserAccountManager(BaseUserManager):
    def create_user(self, dni, password=None, **extra_fields):
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
        user.save()

        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = (
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    )

    dni = models.CharField(max_length=40, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=30)

    id_subsidiary = models.ForeignKey(
        Subsidiary, blank=True, null=True, on_delete=models.DO_NOTHING)

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    is_helper = models.BooleanField(default=False)
    is_exchanger = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'dni'
    REQUIRED_FIELDS = [
        'first_name', 'last_name', 'email', 'date_of_birth', 'phone_number',
        'gender', 'is_exchanger', 'is_helper'
    ]

    def __str__(self):
        return self.dni

    class Meta:
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'


class UserGeneral(models.Model):
    dni = models.CharField(max_length=40, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    id_subsidiary = models.ForeignKey(Subsidiary, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_helper = models.BooleanField(default=False)
    is_exchanger = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'usuario general'
        verbose_name_plural = 'usuarios generales'
