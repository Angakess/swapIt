import requests
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from swap_it.custompermissions import IsStaff
from swap_it.settings import EMAIL_HOST_USER

from user.serializers import UserSerializer
from user.models import UserAccount, UserRegister
from rest_framework import generics
from django.core.mail import send_mail
import random

class CreateUser(generics.CreateAPIView):
    @staticmethod
    def send_email_to_user(user, code):
        subject = 'Activacion de cuenta de: ' + user.first_name + ' ' + user.last_name
        message = 'Ingrese a la siguiente url http://localhost:5173/auth/email-verification/' + code
        from_email = EMAIL_HOST_USER
        to_email = [user.email]
        send_mail(subject, message, from_email, to_email)

    serializer_class = UserSerializer

    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data
            user = UserAccount.objects.create_user(**user_data)

            generated_code = random.randint(100000, 999999)

            user_register = UserRegister.objects.create(code=str(generated_code), user=user)

            self.send_email_to_user(user, str(generated_code))
            
            return Response({'id': user.id, 'code': user_register.code}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ActivateUser(APIView):
    permission_classes = []
    def post(self, request):
        code = request.data.get('code')
        user_register = UserRegister.objects.filter(code=code).first()
        if user_register is None:
            return Response({'error': 'Codigo invalido'}, status=status.HTTP_400_BAD_REQUEST)

        user_register.user.is_active = True
        user_register.user.save()
        user_register.delete()
        return Response({'message': 'Email validado exitosamente'}, status=status.HTTP_204_NO_CONTENT)

class LoginUser(APIView):
    @staticmethod
    def send_email_to_user(user, code):
        subject = 'Codigo de 2FA: ' + user.first_name + ' ' + user.last_name
        message = 'Tu codigo de 2FA es: ' + code
        from_email = EMAIL_HOST_USER
        to_email = [user.email]
        send_mail(subject, message, from_email, to_email)

    permission_classes = []
    def post(self, request):
        dni = request.data.get('dni')
        password = request.data.get('password')
        user = UserAccount.objects.filter(dni=dni).first()

        if user is None or not user.check_password(password):
            return Response({'error': 'Usuario y/o ocontraseña invalida'}, status=status.HTTP_404_NOT_FOUND)
        
        if not user.is_active:
            user_register = UserRegister.objects.filter(user__dni=user.dni).first()
            CreateUser.send_email_to_user(user, user_register.code)
            return Response({'error': 'Usuario no activado'}, status=status.HTTP_404_NOT_FOUND)

        if user.is_exchanger:
            return Response({'id': user.id}, status=status.HTTP_200_OK)
        
        if user.is_helper or user.is_staff:
            code_2fa = random.randint(100000, 999999)
            self.send_email_to_user(user, str(code_2fa))
            return Response({'id': user.id, '2FA CODE': code_2fa}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Algo salio mal :C'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)