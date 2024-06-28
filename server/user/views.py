
import hashlib
import traceback
import coreapi
from app_post.views import PostRemove 
from app_post.models import Post, PostState
from request.models import RequestState
from turn.models import TurnState
from user.serializers import UserBaseSerializer, UserSerializer
from user.models import UserAccount, UserRegister, UserForgotPassword
from subsidiary.models import Subsidiary
from rest_framework import generics
from common.email import send_email_to_user
import random
from rest_framework.response import Response
from rest_framework import status, filters
from rest_framework.views import APIView
from user.serializers import UserCreatedSerializer, ListHelperSerializer, ListExchangerSerializer, ExchangerDetailSerializer, HelperDetailSerializer, UserDetailSerializer
import itertools
from user.models import Role, UserState
import coreschema
from rest_framework.schemas import AutoSchema
from rating.models import Rating
from django.db import  transaction 


class UserScore(APIView):
    def get(self, request, user_id):
        user = UserAccount.objects.filter(pk=user_id).first()
        if user is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['Usuario no encontrado'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                'ok': True,
                'messages': ['Puntuacion obtenida'],
                'data': {'score': user.score}
            },
            status=status.HTTP_200_OK
        )

class CreateUser(generics.CreateAPIView):
    """
        Register user pls
    """
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

            admin = UserAccount.objects.filter(role=Role.ADMIN).first()
            calification = Rating.objects.create(score=5, comment="Bienvenido a SwapIt! :)", user_maker=admin, user_received=user)

            try:
                send_email_to_user(
                    email=[user_register.user.email],
                    subject='Activación de cuenta de: ' +
                    user_register.user.first_name + ' '
                    + user_register.user.last_name,
                    message='Ingrese a la siguiente url'
                    + ' http://localhost:5173/auth/email-verification/' +
                    str(generated_code)
                )
            except:
                return Response(
                    {
                        'ok': False,
                        'messages': ['Usuario creado exitosamente. Hubo un problema al enviar el correo. Para recibir su código de activación, intente iniciar sesión.'],
                        'data': {'user': UserCreatedSerializer(user).data}
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
            try:
                send_email_to_user(
                    email=[already_has_code.user.email],
                    subject='Recuperacion de contraseña de: ' +
                    already_has_code.user.first_name + ' '
                    + already_has_code.user.last_name,
                    message='Ingrese a la siguiente url'
                    + ' http://localhost:5173/auth/reset-password/' +
                    str(already_has_code.code)
                )
            except:
                return Response(
                    {
                        'ok': False,
                        'messages': ['Hubo un problema al enviar el correo. Intente más tarde'],
                        'data': {}
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
        try:
            send_email_to_user(
                email=[user.email],
                subject='Recuperacion de contraseña de: ' +
                user.first_name + ' '
                + user.last_name,
                message='Ingrese a la siguiente url'
                + ' http://localhost:5173/auth/reset-password/' +
                str(generated_code)
            )
        except:
            return Response(
                {
                    'ok': False,
                    'messages': ['Hubo un problema al enviar el correo. Intente más tarde'],
                    'data': {}
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        user_forgot_password = UserForgotPassword.objects.create(
            code=str(generated_code), user=user)

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

            try:
                send_email_to_user(
                    email=[user_register.user.email],
                    subject='Activación de cuenta de: ' +
                    user_register.user.first_name + ' '
                    + user_register.user.last_name,
                    message='Ingrese a la siguiente url'
                    + ' http://localhost:5173/auth/email-verification/' +
                    str(user_register.code)
                )
            except:
                return Response(
                    {
                        'ok': False,
                        'messages': ['Error al hacer login. Hubo un problema al enviar el correo. Intente más tarde'],
                        'data': {}
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
                    'messages': ['Usuario ' + message + ' por favor comuníquese con el administrador en is2.caritas@hotmail.com'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Existe pero la contraseña es incorrecta
        md5_pass = hashlib.md5(password.encode()).hexdigest()
        print("md5_pass", md5_pass)
        print("user.password", user.password)
        if not user.password == md5_pass:
            if user.role == Role.ADMIN:
                return Response(
                    {
                        'ok': False,
                        'messages': ['Usuario y/o contraseña incorrecta.'],
                        'data': {}
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

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
            code_2fa = random.randint(100000, 999999)
            try:
                send_email_to_user(
                    email=[user.email],
                    subject='Codigo de 2FA: ' + user.first_name + ' '
                    + user.last_name,
                    message='Tu codigo de 2FA es: ' + str(code_2fa)
                )
            except:
                return Response(
                    {
                        'ok': False,
                        'messages': ['Error al enviar el correo. Intente mas tarde'],
                        'data': {}
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            user.failed_login_attempts = 0
            user.save()

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


class SearchHelper(generics.ListAPIView):
    """Search Helper"""
    serializer_class = ListHelperSerializer

    def get_queryset(self):
        return UserAccount.objects.filter(role=Role.HELPER)


class SearchExchanger(generics.ListAPIView):
    """Search Exchanger"""

    serializer_class = ListExchangerSerializer
    def get_queryset(self):
        return UserAccount.objects.filter(role=Role.EXCHANGER)


class DisincorporateHelper(APIView):
    def delete(self, request, id):
        helper = UserAccount.objects.filter(pk=id, role= Role.HELPER).first()
        if helper is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['Usuario no encontrado'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        subsidiary = helper.id_subsidiary # NOTE: id_subsidiary is a subsidiary object

        if (subsidiary.users.count() == 1):
            ok = subsidiary.deactivate()
            if not ok:
                #FIXME: Revisar el mensaje de error
                return Response(
                    {
                        'ok': False,
                        'messages': ['Error al desincorporar el usuario, hubieron problemas al enviar los correos.'],
                        'data': {}
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        helper.delete()
        return Response(
            {
                'ok': True,
                'messages': ['Usuario eliminado exitosamente'],
                'data': {}
            },
            status=status.HTTP_200_OK
        )
    
class RetrieveExchanger(generics.RetrieveAPIView):
    def get_queryset(self):
        return UserAccount.objects.filter(role=Role.EXCHANGER)
    
    serializer_class = ExchangerDetailSerializer

class RetrieveHelper(generics.RetrieveAPIView):
    def get_queryset(self):
        return UserAccount.objects.filter(role=Role.HELPER)
    
    serializer_class = HelperDetailSerializer


class ChangeHelperFilial(APIView):
    def post(self, request, helper_id, filial_id):
        helper = UserAccount.objects.filter(pk=helper_id, role=Role.HELPER).first()
        new_subsidiary = Subsidiary.objects.filter(pk=filial_id).first()
        if helper is None or new_subsidiary is None:
            messages = []
            if helper is None:
                messages.append('Usuario no encontrado')
            if new_subsidiary is None:
                messages.append('Filial no encontrada')
            return Response(
                {
                    'ok': False,
                    'messages': messages,
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        if (new_subsidiary.cant_current_helpers >= new_subsidiary.max_helpers):
            return Response(
                {
                    'ok': False,
                    'messages': ['Esta filial ya tiene el cupo de ayudantes completo'],
                    'data': {}
                },
                status=status.HTTP_412_PRECONDITION_FAILED
            )
        
        old_subsidiary = helper.id_subsidiary
        if (old_subsidiary.cant_current_helpers == 1):
            ok = old_subsidiary.deactivate()
            if not ok:
                return Response(
                    {
                        'ok': False,
                        'messages': ['Error al cambiar de filial, hubieron problemas al enviar los correos.'],
                        'data': {}
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        helper.id_subsidiary = new_subsidiary
        helper.save()
        return Response(
            {
                'ok': True,
                'messages': ['Usuario cambiado de filial exitosamente'],
                'data': {}
            },
            status=status.HTTP_200_OK
        )
    
class PutInReviewUser(APIView):
    def get(self, request, user_id):
        user = UserAccount.objects.filter(pk=user_id).first()
        if user is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['Usuario no encontrado'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        ok = user.review()
        if ok:
            return Response(
                {
                    'ok': True,
                    'messages': ['Usuario puesto en revision exitosamente'],
                    'data': {}
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                'ok': False,
                'messages': ['Error al cambiar el estado del usuario. Intente de nuevo mas tarde.'],
                'data': {}
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class RemoveUser(APIView):

    @staticmethod
    def remove_post(post):
        try:

            requests_receive = post.posts_receive.all()
            emails_makers = list(requests_receive.values_list('user_maker__email', flat=True).distinct())

            # La request donde el post es el solicitante
            requests_send = post.posts_send.all()
            emails_received = list(requests_send.values_list(
                'user_receive__email', flat=True).distinct())
            
            turns_send = post.turns_send.all()
            turns_receive = post.turns_receive.all()
            turns_emails_makers = list(turns_send.values_list('user_received__email', flat=True).distinct())
            turns_emails_received = list(turns_receive.values_list('user_maker__email', flat=True).distinct())


            try:
                send_email_to_user(
                    email=emails_makers,
                    subject="Solicitud de intercambio enviada cancelada",
                    message="La solicitud de intercambio enviada" +
                    " ha sido cancelada dado que" +
                    " el propietario elimino la publicación " +
                    post.name + ". \n"
                )

                send_email_to_user(
                    email=emails_received,
                    subject="Solicitud de intercambio recibida cancelada",
                    message="La oferta de intercambio recibida " +
                    " ha sido cancelada dado que el propietario elimino " +
                    "la publicación " +
                    post.name + ". \n"
                )

                send_email_to_user(
                    email=turns_emails_makers,
                    subject="Turno cancelado",
                    message="El turno que ibas a realizar con " +
                    "la publicación " + post.name + " ha sido cancelado " +
                    "dado que el propietario elimino su cuenta. \n"
                )
                send_email_to_user(
                    email=turns_emails_received,
                    subject="Turno cancelado",
                    message="El turno que ibas a realizar con " +
                    "la publicación " + post.name + " ha sido cancelado " +
                    "dado que el propietario elimino su cuenta. \n"
                )

            except Exception as _e:
                raise Exception("Error al enviar correos")
            state = RequestState.objects.get(name="rechazado")
            requests_receive.update(state=state)
            requests_send.update(state=state)

            for turn in turns_receive:
                turn.post_maker.stock_product += 1
                turn.post_receive.stock_product += 1
                turn.post_maker.save()
                turn.post_receive.save()
            
            for turn in turns_send:
                turn.post_maker.stock_product += 1
                turn.post_receive.stock_product += 1
                turn.post_maker.save()
                turn.post_receive.save()
            
            state = TurnState.objects.get(name="no efectuado")
            turns_send.update(state=state, day_of_turn=None)
            turns_receive.update(state=state, day_of_turn=None)
            post.state=PostState.objects.get(id=5)
            post.save()
            return {"ok": True, "messages": ["Publicación eliminada"], "post":post}
        except KeyError:
                raise Exception("Error al eliminar")



    def delete(self, request, user_id, *args, **kwargs):
        user = UserAccount.objects.filter(pk=user_id)
        if user is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['Usuario no encontrado'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )
        posts = user.first().posts.all()
        with transaction.atomic():
            try:
                for post in posts:
                    response = self.remove_post(post)
                    print("[RESPONSE REMOVE POST] \n", response)
            except Exception as e:
                print(traceback.format_exc())
                return Response(
                    {
                        'ok': False,
                        'messages': ['Error al eliminar el usuario. Intente de nuevo mas tarde.'],
                        'data': {}
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        ok = user.update(state= UserState.objects.get(id=5))
        if ok:
            return Response(
                {
                    'ok': True,
                    'messages': ['Usuario eliminado exitosamente'],
                    'data': UserBaseSerializer(user[0]).data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                'ok': False,
                'messages': ['Error al eliminar el usuario. Intente de nuevo mas tarde.'],
                'data': {}
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


#TODO: Revisar si hay que hacer algo antes de actualizar.
class UpdateUser(generics.UpdateAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = UserBaseSerializer

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)


class RetrieveUser(generics.RetrieveAPIView):
    queryset = UserAccount.objects.all()
    serializer_class = UserDetailSerializer
