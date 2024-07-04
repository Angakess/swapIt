from django.shortcuts import render
from rest_framework import generics, filters, status
from rest_framework.response import Response

from app_post.models import Category
from stockFilial.models import StockFilial
from .models import Subsidiary
from .serializers import SubsidiarySerializer

class SubsidiaryDetails(generics.RetrieveUpdateDestroyAPIView):

    def get_queryset(self):
        return Subsidiary.objects.all()

    def destroy(self, request, *args, **kwargs):
        pk = kwargs['pk']
        subsidiary = Subsidiary.objects.filter(pk=pk).first()
        if not subsidiary:
            return Response(
                {
                    'ok': False,
                    'messages': ['Filial no encontrada'],
                    'data': {}
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if (subsidiary.cant_current_helpers>0):
            return Response(
                {
                    'ok': False,
                    'messages': ['La filial tiene empleados activos, esta no se puede eliminar'],
                    'data': {}
                },
                status=status.HTTP_412_PRECONDITION_FAILED
            )
        
        ok = subsidiary.deactivate()

        if ok:
            return Response(
                    {
                        'ok': True,
                        'messages': ['Filial eliminada correctamente'],
                        'data': {}
                    },
                    status=status.HTTP_200_OK
                )
        else:
            return Response(
                {
                    'ok': False,
                    'messages': ['Error al eliminar la categoria, hubieron problemas al enviar los correos.'],
                    'data': {}
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    serializer_class = SubsidiarySerializer


class SubsidiaryCreate(generics.CreateAPIView):
    queryset = Subsidiary.objects.all()
    serializer_class = SubsidiarySerializer

    def create(self, request, *args, **kwargs):
        newFilial = super().create(request, *args, **kwargs)
        instance = Subsidiary.objects.get(pk=newFilial.data['id'])
        categories = Category.objects.all()

        for category in categories:
            StockFilial.objects.create(
                filial=instance,
                categoria=category,
                cantidad=0
            )
        return newFilial

class SubsidiaryList(generics.ListAPIView):
    def get_queryset(self):
        return Subsidiary.objects.all()
    
    search_fields = ['name']
    filter_backends = [filters.SearchFilter]


    serializer_class = SubsidiarySerializer
