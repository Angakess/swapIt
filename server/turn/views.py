from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Turn, TurnState
from .serializers import (
    TurnHelperListSerializer,
    TurnExchangerListSerializer,
    TurnSerializer,
    TurnDetailSerializer
)
from rest_framework import generics


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


class TurnsValidateView(APIView):
    def post(self, request):
        data = request.data
        id_turn = data.get("id_turn")
        turn = Turn.objects.get(id=id_turn)
        code_maker, code_received = data.get("code_maker"), data.get("code_received")
        if code_maker != turn.code_maker or code_received != turn.code_received:
            return Response(
                {"ok": False, "messages": ["Los códigos no coinciden."], "data": {}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        turn.state = TurnState.objects.get(name="efectuado")
        turn.save()
        return Response(
            {"ok": True, "messages": ["Turno validado."], "data": {}},
            status=status.HTTP_200_OK,
        )


# [{"id_turn":1},{"id_turn":2},{"id_turn":3},{"id_turn":4},{"id_turn":5}]


class TurnsRejectView(APIView):
    def post(self, request):
        data = request.data
        ids_turns = [item["id_turn"] for item in data]
        turns = Turn.objects.filter(id__in=ids_turns)
        for turn in turns:
            turn.state = TurnState.objects.get(name="no efectuado")
            turn.save()
        return Response(
            {
                "ok": True,
                "messages": ["Turno guardado como no efectuado."],
                "data": TurnSerializer(turns, many=True).data,
            },
            status=status.HTTP_200_OK,
        )
    
class DetailTurnView(generics.RetrieveAPIView):
    queryset = Turn.objects.all()
    serializer_class = TurnDetailSerializer