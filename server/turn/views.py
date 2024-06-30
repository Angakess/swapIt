from django.shortcuts import render
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from common.email import send_email_to_user

from request.serializers import RequestSerializer
from request.models import Request
from rating.models import Rating
from user.models import UserAccount
from .models import Turn, TurnState
from app_post.models import PostState
from .serializers import (
    TurnHelperListSerializer,
    TurnExchangerListSerializer,
    TurnSerializer,
    TurnDetailSerializer
)
from rest_framework import generics


class ListTurnsByPostId(APIView):

    def get(self, request, id_post):
        turns = Turn.objects.filter(Q(post_maker__id=id_post) |
                                    Q(post_receive__id=id_post))
        serializer = TurnExchangerListSerializer(turns, many=True)
        if not serializer.data:
            return Response({
                "ok": False,
                "messages": ["No se encontraron turnos."],
                "data": {}
            }, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "ok": True,
            "messages": ["Turnos encontrados."],
            "data": serializer.data
        })


class ListMyTurns(APIView):
    def get(self, request, id_user):
        turns_make = Turn.objects.filter(user_maker__id=id_user, state__id=1)
        turns_received = Turn.objects.filter(
            user_received__id=id_user, state__id=1)
        serializer = TurnExchangerListSerializer(
            turns_make.union(turns_received), many=True
        )
        print(serializer.data)
        return Response(serializer.data)

        # {"date": "2024-06-02", "id_subsidiary": 2}


class ListTurnsTodayView(APIView):
    def post(self, request):
        data = request.data
        date, id_helper = data.get("date"), data.get("id_helper")
        helper = UserAccount.objects.get(id=id_helper)
        turns = Turn.objects.filter(
            subsidiary__id=helper.id_subsidiary.id,
            day_of_turn=date,
            state__id=1
        )
        serializer = TurnHelperListSerializer(turns, many=True)
        return Response(serializer.data)


class TurnsValidateView(APIView):
    def post(self, request):
        data = request.data
        id_turn = data.get("id_turn")
        turn = Turn.objects.get(id=id_turn)
        code_maker, code_received = data.get(
            "code_maker"), data.get("code_received")
        if code_maker != turn.code_maker or code_received != turn.code_received:
            return Response(
                {"ok": False, "messages": [
                    "Los códigos no coinciden."], "data": {}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email_maker = turn.user_maker.email
        name_maker = turn.user_maker.full_name
        email_received = turn.user_received.email
        name_received = turn.user_received.full_name
        score_maker = turn.post_maker.value
        score_received = turn.post_receive.value

        try:      
            send_email_to_user(
                [email_maker],
                "Califica tu intercambio",
                f"¡Felicitaciones {name_maker}! Has finalizado un intercambio con {name_received}, has sumado {score_maker} puntos. \n" +
                f"Puedes calificar a {name_received} en el siguiente enlace: http://localhost:5173/user/calificate/M-{id_turn} \n" +
                f"¡Gracias por confiar en SwapIt!"
            )

            send_email_to_user(
                [email_received],
                "Califica tu intercambio",
                f"¡Felicitaciones {name_received}! Has finalizado un intercambio con {name_maker}, has sumado {score_received} puntos. \n" +
                f"Puedes calificar a {name_maker} en el siguiente enlace: http://localhost:5173/user/calificate/R-{id_turn} \n" +
                f"¡Gracias por confiar en SwapIt!"
            )
        except:
            return Response(
                {"ok": False, "messages": [
                    "Error al validar un turno, hubo un error al enviar los correos."], "data": {}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        turn.state = TurnState.objects.get(name="efectuado")
        turn.user_maker.score += score_maker
        turn.user_received.score += score_received
        turn.user_maker.save()
        turn.user_received.save()
        turn.save()
        return Response(
            {"ok": True, "messages": ["Turno validado."], "data": {}},
            status=status.HTTP_200_OK,
        )


class TurnsRejectView(APIView):
    def post(self, request):
        data = request.data
        # [{"id_turn":1},{"id_turn":2},{"id_turn":3},{"id_turn":4},{"id_turn":5}]
        ids_turns = [item["id_turn"] for item in data]
        turns = Turn.objects.filter(id__in=ids_turns)
        for turn in turns:
            turn.state = TurnState.objects.get(name="no efectuado")
            post_maker = turn.post_maker
            post_receive = turn.post_receive

            if post_maker.stock_product == 0 and post_maker.state.id == 7:
                post_maker.state = PostState.objects.filter(id=1).first()

            if post_receive.stock_product == 0 and post_receive.state.id == 7:
                post_receive.state = PostState.objects.filter(id=1).first()

            post_maker.stock_product += 1
            post_receive.stock_product += 1
            post_maker.save()
            post_receive.save()
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
    queryset = Turn.objects.filter(state__id=1)
    serializer_class = TurnDetailSerializer


class ListTurns(generics.ListAPIView):
    queryset = Turn.objects.all()
    serializer_class = TurnSerializer

    def get(self, request):
        turns = Turn.objects.all()
        requests = Request.objects.all()
        r_serializer = RequestSerializer(requests, many=True)
        serializer = TurnSerializer(turns, many=True)
        return Response({
            "ok": True,
            "messages": ["Turnos encontrados."],
            "data": {"turns": serializer.data,
                     "requests": r_serializer.data}
        },
          status=status.HTTP_200_OK  )