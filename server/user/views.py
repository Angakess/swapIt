
import coreapi
from user.serializers import UserSerializer
from user.models import UserAccount, UserRegister, UserForgotPassword
from rest_framework import generics
from common.email import send_email_to_user
import random
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from user.serializers import UserCreatedSerializer
import itertools
from user.models import Role, UserState
import coreschema
from rest_framework.schemas import AutoSchema


class CreateUser(generics.CreateAPIView):
    """Register user"""
    serializer_class = UserSerializer

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        dni = serializer.initial_data['dni']

        user_of_dni = UserAccount.objects.filter(dni=dni).first()

        # NOTE: Usuario existente y bloqueado
        if user_of_dni is not None and user_of_dni.state.id == 5:
            return Response(
                {
                    'ok': False,
                    'messages': ['Esta cuenta ha sido borrada y no es posible registrar usuarios previamente borrados, por favor comuniquese con el administrador en is2.caritas@hotmail.com'],
                    'data': {}
                }
            )

        if serializer.is_valid():
            user_data = serializer.validated_data
            user = UserAccount.objects.create_user(**user_data)

            generated_code = random.randint(100000, 999999)

            user_register = UserRegister.objects.create(
                code=str(generated_code), user=user)

            send_email_to_user(
                email=user_register.user.email,
                subject='Activación de cuenta de: ' +
                user_register.user.first_name + ' '
                + user_register.user.last_name,
                message='Ingrese a la siguiente url'
                + ' http://localhost:5173/auth/email-verification/' +
                str(generated_code)
            )

            return Response(
                {
                    'ok': True,
                    'messages': ['Usuario creado exitosamente'],
                    'data': {'user': UserCreatedSerializer(user).data},
                }, status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'ok': False,
                'messages': list(itertools.chain(*serializer.errors.values())),
                'data': {}
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class ActivateUser(APIView):

    schema = AutoSchema(manual_fields=[
        coreapi.Field(
            "code",
            required=True,
            location="form",
            schema=coreschema.String()
        ),
    ])

    def post(self, request):

        code = request.data.get('code')
        user_register = UserRegister.objects.filter(code=code).first()
        if user_register is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['Codigo invalido'],
                    'data': {},
                }, status=status.HTTP_400_BAD_REQUEST
            )

        user_register.user.is_active = True
        state = UserState.objects.get(id=3)
        user_register.user.state = state
        user_register.user.save()
        user_register.delete()
        return Response({
            'ok': True,
            'messages': ['Email validado exitosamente'],
            'data': {},
        }, status=status.HTTP_200_OK)
    
class ForgotPassword(APIView):
    def post(self, request):
        dni = request.data.get('dni')
        user = UserAccount.objects.filter(dni=dni).first()
        if user is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['Usuario no encontrado'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Existe pero esta suspendido o bloqueado o eliminado
        if user.state.id != 3:
            return Response(
                {
                    'ok': False,
                    'messages': ['Este usuario no puede solicitar la recuperacion de contraseña, por favor comuniquese con el administrador en is2.caritas@hotmail.com'],
                },
                status=status.HTTP_404_NOT_FOUND
            )

        already_has_code = UserForgotPassword.objects.filter(
            user__dni=dni).first()

        if (already_has_code is not None):
            send_email_to_user(
                email=already_has_code.user.email,
                subject='Recuperacion de contraseña de: ' +
                already_has_code.user.first_name + ' '
                + already_has_code.user.last_name,
                message='Ingrese a la siguiente url'
                + ' http://localhost:5173/auth/reset-password/' +
                str(already_has_code.code)
            )
            return Response(
                {
                    'ok': True,
                    'messages': ['Codigo enviado exitosamente'],
                    'data': {}
                },
                status=status.HTTP_200_OK
            )

        generated_code = random.randint(100000, 999999)
        user_forgot_password = UserForgotPassword.objects.create(
            code=str(generated_code), user=user)

        send_email_to_user(
            email=user_forgot_password.user.email,
            subject='Recuperacion de contraseña de: ' +
            user_forgot_password.user.first_name + ' '
            + user_forgot_password.user.last_name,
            message='Ingrese a la siguiente url'
            + ' http://localhost:5173/auth/reset-password/' +
            str(generated_code)
        )

        return Response(
            {
                'ok': True,
                'messages': ['Codigo enviado exitosamente'],
                'data': {}
            },
            status=status.HTTP_200_OK
        )


class ResetPassword(APIView):
    def post(self, request):
        code = request.data.get('code')
        user_forgot_password = UserForgotPassword.objects.filter(
            code=code).first()
        if user_forgot_password is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['Codigo invalido'],
                    'data': {},
                }, status=status.HTTP_400_BAD_REQUEST
            )

        if user_forgot_password.user.state.id != 3:
            return Response(
                {
                    'ok': False,
                    'messages': ['Este usuario no puede solicitar la recuperacion de contraseña, por favor comuniquese con el administrador en is2.caritas@hotmail.com'],
                },
                status=status.HTTP_404_NOT_FOUND
            )

        user_forgot_password.user.set_password(request.data.get('password'))
        user_forgot_password.user.save()
        user_forgot_password.delete()
        return Response({
                'ok': True,
                'messages': ['Contraseña cambiada exitosamente'],
                'data': {}
            }, status=status.HTTP_200_OK
        )


class LoginUser(APIView):
    """Login user account"""
    permission_classes = []

    def post(self, request):
        dni = request.data.get('dni')
        password = request.data.get('password')
        user = UserAccount.objects.filter(dni=dni).first()

        # No existe el usuario
        if user is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['Usuario y/o ocontraseña invalida'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Existe pero no esta activo
        if not user.is_active:
            user_register = UserRegister.objects.filter(
                user__dni=user.dni).first()

            send_email_to_user(
                email=user_register.user.email,
                subject='Activación de cuenta de: ' +
                user_register.user.first_name + ' '
                + user_register.user.last_name,
                message='Ingrese a la siguiente url'
                + ' http://localhost:5173/auth/email-verification/' +
                str(user_register.code)
            )
            return Response(
                {
                    'ok': False,
                    'messages': ['Usuario no activado'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Existe pero esta suspendido o bloqueado o eliminado
        if user.state.id == 1 or user.state.id == 2 or user.state.id == 5:
            message = ''
            if user.state.id == 2:
                message = 'suspendido por intentos fallidos,'
            else:
                message = 'bloqueado,' if user.state.id == 1 else 'eliminado,'

            return Response(
                {
                    'ok': False,
                    'messages': ['Usuario ' + message + ', por favor comuníquese con el administrador en is2.caritas@hotmail.com'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Existe pero la contraseña es incorrecta
        if not user.check_password(password):
            if user.failed_login_attempts >= 2:
                state = UserState.objects.get(id=2)
                user.state = state
                user.failed_login_attempts = 3
                user.save()
                return Response(
                    {
                        'ok': False,
                        'messages': ['Usuario bloqueado por exceso de intentos fallidos, por favor comuníquese con el administrador en is2.caritas@hotmail.com'],
                        'data': {}
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            user.failed_login_attempts += 1
            user.save()
            return Response(
                {
                    'ok': False,
                    'messages': ['Contraseña incorrecta solo quedan ' + str(3 - user.failed_login_attempts) + ' intentos'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if user.role == Role.EXCHANGER:
            user.failed_login_attempts = 0
            user.save()
            return Response({
                'ok': True,
                'messages': ['Usuario logeado exitosamente'],
                'data': {'user': UserCreatedSerializer(user).data}
            }, status=status.HTTP_200_OK
            )

        elif user.role == Role.ADMIN or user.role == Role.HELPER:
            user.failed_login_attempts = 0
            user.save()
            code_2fa = random.randint(100000, 999999)

            send_email_to_user(
                email=user.email,
                subject='Codigo de 2FA: ' + user.first_name + ' '
                + user.last_name,
                message='Tu codigo de 2FA es: ' + str(code_2fa)
            )

            return Response(
                {
                    'ok': True,
                    'messages': ['Enviado el codigo 2FA'],
                    'data': {
                        'user': UserCreatedSerializer(user).data,
                        '2FA CODE': code_2fa
                    },
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                'ok': False,
                'messages': ['Algo salio mal :C'],
                'data': {}
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
