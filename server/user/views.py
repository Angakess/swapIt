import requests
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from swap_it.custompermissions import IsStaff


def activation_user(request, uid, token):
    url = 'http://localhost:8000/auth/users/activation/'
    data = {'uid': uid, 'token': token}
    response = requests.post(url, data=data)

    if response.status_code == 204:
        return render(request, 'activate.html')
    else:
        return HttpResponse('Error en la solicitud POST')


class ListaVista(APIView):
    def get(self, request, format=None):
        print('user', self.request.user)
        data = {'lista': ['a', 'b']}
        return Response(data, status=status.HTTP_200_OK)

    permission_classes = [IsAuthenticated, IsStaff]
