from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Turn
from .serializers import TurnHelperListSerializer, TurnExchangerListSerializer


class ListMyTurns(APIView):
    def get(self, request, id_user):
        turns_make = Turn.objects.filter(user_maker__id=id_user)
        turns_received = Turn.objects.filter(user_received__id=id_user)
        serializer = TurnExchangerListSerializer(
            turns_make.union(turns_received), many=True
        )
        print(serializer.data)
        return Response(serializer.data)

        # {"date": "2024-06-02", "id_subsidiary": 2}


class ListTurnsTodayView(APIView):
    def post(self, request):
        data = request.data
        date, subsidiary = data.get("date"), data.get("id_subsidiary")
        turns = Turn.objects.filter(
            subsidiary__id=subsidiary, request__day_of_request=date
        )
        serializer = TurnHelperListSerializer(turns, many=True)
        return Response(serializer.data)
