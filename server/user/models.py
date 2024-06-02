from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin,
                                        BaseUserManager)
from subsidiary.models import Subsidiary
from django.db.models import Avg
from common.email import send_email_to_user


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
    rejected_posts = models.IntegerField(default=0)
    score = models.IntegerField(default=0)
    id_subsidiary = models.ForeignKey(
        Subsidiary, blank=True, null=True, on_delete=models.DO_NOTHING, related_name='users'
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

    objects = UserAccountManager()

    USERNAME_FIELD = 'dni'
    REQUIRED_FIELDS = [
        'first_name', 'last_name', 'email', 'date_of_birth', 'phone_number',
        'gender'
    ]

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'

    @property
    def rating(self):
        return self.ratings_received.aggregate(prom=Avg('score'))['prom'] or 0


    def review(self):
        #BAJA DE TURNOS
        turns_made = self.turns_made.all()
        received_emails = list(turns_made.values_list('user_received__email', flat=True).distinct())

        turns_received = self.turns_received.all()
        made_emails = list(turns_received.values_list('user_maker__email', flat=True).distinct())

        try:
            send_email_to_user(
                email=received_emails + made_emails,
                subject='Turnos cancelados del usuario ' + self.full_name,
                message= 'Los turnos con el usuario' + self.full_name + 
                    ' han sido cancelados, por lo que no debera asistir \n' +
                    'Para saber sus proximos turnos, puede revisarlos en la aplicación. \n'
            )

            requests_receive = self.requests_receive.all()
            requests_send = self.requests_send.all()

            request_received_emails = list(requests_receive.values_list('user_maker__email', flat=True).distinct())
            send_email_to_user(
                email=request_received_emails,
                subject='Solicitud de intercambio cancelada',
                message='La solicitud de intercambio con el usuario ' + self.full_name + ' ha sido cancelada debido a que la publicacion del usuario se ha bloqueado. \n'
            )

            send_email_to_user(
                email = [self.email],
                subject='Cuenta en revisión',
                message='Su cuenta ha pasado a un estado de revisión por haber excedido el límite de publicaciones rechazadas. \n'
            )
        except Exception as e:
            return False

        turns_made.delete()
        turns_received.delete()
        requests_receive.delete()
        requests_send.delete()

        # BAJA DE PUBLICACIONES
        posts = self.posts.all()
        posts.update(state=4)
        
        self.state = UserState.objects.get(id=2)
        self.save()

        return True

    def __str__(self):
        return self.full_name + ' ' + str(self.id)

    class Meta:
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'


class UserRegister(models.Model):
    code = models.CharField(max_length=255)
    user = models.OneToOneField(
        UserAccount, on_delete=models.CASCADE, related_name='user_register')

    def __str__(self):
        return f"Code: {self.code}, User: {self.user.dni}"


class UserForgotPassword(models.Model):
    code = models.CharField(max_length=255)
    user = models.OneToOneField(
        UserAccount, on_delete=models.CASCADE, related_name='user_forgot_password')

    def __str__(self):
        return f"Code: {self.code}, User: {self.user.dni}"
