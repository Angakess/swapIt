
from user.serializers import UserSerializer
from user.models import UserAccount, UserRegister
from rest_framework import generics
from common.email import send_email_to_user
import random
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from user.serializers import UserCreatedSerializer
import itertools
from user.models import Role


class CreateUser(generics.CreateAPIView):
    """Register user"""
    serializer_class = UserSerializer

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data
            user = UserAccount.objects.create_user(**user_data)

            generated_code = random.randint(100000, 999999)

            user_register = UserRegister.objects.create(
                code=str(generated_code), user=user)

            send_email_to_user(
                email=user_register.user.email,
                subject='Activacion de cuenta de: ' +
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
    """Activate user account"""
    permission_classes = []

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
        user_register.user.state = 3
        user_register.user.save()
        user_register.delete()
        return Response({
            'ok': True,
            'messages': ['Email validado exitosamente'],
            'data': {}
        }, status=status.HTTP_204_NO_CONTENT)


class LoginUser(APIView):
    """Login user account"""
    permission_classes = []

    def post(self, request):
        dni = request.data.get('dni')
        password = request.data.get('password')
        user = UserAccount.objects.filter(dni=dni).first()

        if user is None or not user.check_password(password):
            # TODO: CHECK FAILED LOGIN ATTEMPTS
            return Response(
                {
                    'ok': False,
                    'message': ['Usuario y/o ocontraseña invalida'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if not user.is_active:
            user_register = UserRegister.objects.filter(
                user__dni=user.dni).first()

            send_email_to_user(
                email=user_register.user.email,
                subject='Activacion de cuenta de: ' +
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

        if user.role == Role.EXCHANGER:
            return Response({
                'ok': True,
                'messages': ['Usuario logeado exitosamente'],
                'data': {'user': UserCreatedSerializer(user).data}
            }, status=status.HTTP_200_OK
            )
        elif user.role == Role.ADMIN or user.role == Role.HELPER:
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
