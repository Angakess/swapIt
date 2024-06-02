from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Turn
from .serializers import TurnSerializer


class ListMyTurns(APIView):
    def get(self, request, id_user):
        turns_make = Turn.objects.filter(user_maker__id=id_user)
        turns_received = Turn.objects.filter(user_received__id=id_user)
        print("[turns_received]", turns_make.union(turns_received))
        serializer = TurnSerializer(turns_make.union(turns_received), many=True)
        return Response(serializer.data)

        # {"date": "2024-06-02", "id_subsidiary": 3}


class ListTurnsTodayView(APIView):
    def post(self, request):
        data = request.data
        print("[data]", data)
        date = data.get("date")
        print("[date]", date)
        subsidiary = data.get("id_subsidiary")

        print("[subsidiary]", subsidiary)
        turns = Turn.objects.filter(
            subsidiary__id=subsidiary, request__day_of_request=date
        )
        print("[turns]", turns)
        serializer = TurnSerializer(turns, many=True)
        return Response(serializer.data)
