from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import StockFilial
from .serializers import StockFilialSerializer, StockFilialUpdateSerializer


class RetrieveStockFilial(generics.RetrieveAPIView):
    queryset = StockFilial.objects.all()
    serializer_class = StockFilialSerializer

    def retrieve(self, request, pk, *args, **kwargs):
        instance = self.queryset.filter(filial__id=pk)
        serializer = StockFilialSerializer(instance, many=True)
        return Response({
                    'ok': True,
                    'messages': [f'Stock de la filial {pk} obtenido correctamente'],
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
class UpdateStockFilial(generics.UpdateAPIView):
    queryset = StockFilial.objects.all()
    serializer_class = StockFilialUpdateSerializer

    # def partial_update(self, request, *args, **kwargs):
    #     filial_id = request.data.get('filial_id')
    #     categoria_id = request.data.get('categoria_id')
    #     instance = self.queryset.filter(categoria__id=categoria_id, filial__id=filial_id)
    #     serializer = StockFilialSerializer(instance, many=True)
    #     return Response({
    #                 'ok': True,
    #                 'messages': [f'Categoria {categoria_id} de la filial {filial_id} actualizado correctamente'],
    #                 'data': serializer.data
    #             },
    #             status=status.HTTP_200_OK
    #         )