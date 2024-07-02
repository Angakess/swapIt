import traceback
from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from user.models import UserAccount
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
#     {"cantidad": 10,"id_user":150}


class UpdateStockFilial(generics.UpdateAPIView):
    queryset = StockFilial.objects.all()
    serializer_class = StockFilialUpdateSerializer

    def partial_update(self, request, *args, **kwargs):
        print("[INFO] [UPDATE STOCK FILIAL]", request.data, kwargs)
        try:
            id_user = request.data['id_user']
            instance = self.queryset.filter(pk=kwargs['pk']).first()
            instance.cantidad -= 1
            user = UserAccount.objects.filter(pk=id_user).first()
            user.score -= instance.categoria.score
            user.save()
            instance.save()
            return Response({
                'ok': True,
                'messages': [f'Stock de la filial actualizado correctamente'],
                'data': {
                    "stock":StockFilialUpdateSerializer(instance).data, 
                    "user-score":user.score
                    }
            }, status=status.HTTP_200_OK)
        except KeyError as e:
            #Actualiza el stock de la filial
            try:
                instance = self.queryset.filter(pk=kwargs['pk']).first()
                instance.cantidad = request.data['cantidad']
                instance.save()
                return Response(
                    {
                        'ok': True,
                        'messages': [f'Stock de la filial actualizado correctamente']
                    }, status=status.HTTP_200_OK)
            except Exception as e:
                print("[ERROR] [UPDATE STOCK FILIAL]\n")
                traceback.print_exc()
                return Response(
                    {
                        'ok': False,
                        'messages': [f'Error al actualizar el stock de la filial']
                    }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:

            print("[ERROR] [UPDATE STOCK FILIAL]\n")
            traceback.print_exc()
            return Response(
                {
                    'ok': False,
                    'messages': [f'Error al actualizar el stock de la filial']
                }, status=status.HTTP_400_BAD_REQUEST)
