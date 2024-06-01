from rest_framework import generics, filters, status
from request.models import Request, RequestState
from request.serializer import (
    RequestSerializer,
    RequestStateSerializer,
    RequestCreateSerializer,
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from user.models import UserAccount
from app_post.models import Post
from .models import RequestState
from rest_framework.response import Response
from datetime import datetime
from common.email import send_email_to_user


class RequestList(generics.ListAPIView):

    def get_queryset(self):
        return Request.objects.all()

    serializer_class = RequestSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = [
        "state__name",
        "post_maker",
        "post_receive",
        "user_maker__dni",
        "user_receive__dni",
        "user_maker__id",
        "user_receive__id",
    ]


class RequestListMaker(APIView):

    def get(self, _request, user_id):
        states = [2, 4]
        requests = Request.objects.filter(user_maker__id=user_id, state__id__in=states)
        if len(requests) == 0:
            return Response(
                {
                    "ok": False,
                    "messages": ["No se encontraron solicitudes"],
                    "data": {},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "ok": True,
                "messages": ["Solicitudes encontradas"],
                "data": {'requests' : RequestSerializer(requests, many=True).data},
            },
            status=status.HTTP_200_OK,
        )


class RequestListReceive(APIView):

    def get(self, _request, user_id):
        states = [2, 4]
        requests = Request.objects.filter(
            user_receive__id=user_id, state__id__in=states
        )
        if len(requests) == 0:
            return Response(
                {
                    "ok": False,
                    "messages": ["No se encontraron solicitudes"],
                    "data": {},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "ok": True,
                "messages": ["Solicitudes encontradas"],
                "data": {"requests": RequestSerializer(requests, many=True).data},
            },
            status=status.HTTP_200_OK,
        )


class RequestCreate(APIView):
    # NOTE: No me fijo si el producto que ofrezco tiene stock, porque no debemos listarle productos sin stock para ofrecer.
    def post(self, request):
        data = request.data
        id_user_maker = data['user_maker']
        id_post_maker = data['post_maker']
        id_user_receive = data['user_receive']
        id_post_receive = data['post_receive']

        user_maker_data = UserAccount.objects.filter(id=id_user_maker).first()
        user_receive_data = UserAccount.objects.filter(id=id_user_receive).first()
        post_maker_data = Post.objects.filter(id=id_post_maker).first()
        post_receive_data = Post.objects.filter(id=id_post_receive).first()

        if (user_maker_data is None or user_receive_data is None or post_maker_data is None or post_receive_data is None):
            return Response(
                {
                    'ok': False,
                    'messages': ['Error al crear la solicitud. No se encontraron los datos necesarios'],
                    'data':{}
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if user_maker_data.requests_send.filter(state__id=2).count() >= 5:
            return Response(
                {
                    'ok': False,
                    'messages': ['No puedes realizar más de 5 solicitudes pendientes'],
                    'data':{}
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    

        request_object = Request.objects.filter(user_maker__id=id_user_maker, post_maker__id = id_post_maker, user_receive__id=id_user_receive, post_receive__id=id_post_receive).first()
        # Si no existe, creo la solicitud
        if request_object is None:
            user_maker = UserAccount.objects.filter(id=id_user_maker).first()
            post_maker = Post.objects.filter(id=id_post_maker).first()
            user_receive = UserAccount.objects.filter(id=id_user_receive).first()
            post_receive = Post.objects.filter(id=id_post_receive).first()
            state = RequestState.objects.filter(id=2).first()

            # Restamos el stock
            post_maker.stock_product -= 1
            post_maker.save()

            request_created = Request.objects.create(
                post_maker=post_maker,
                post_receive=post_receive,
                user_maker=user_maker,
                user_receive=user_receive,
                state=state,
            )
            request_created.save()
            return Response(
                {
                    "ok": True,
                    "messages": ["Solicitud creada con éxito"],
                    "data": {"Request": RequestSerializer(request_created).data},
                },
                status=status.HTTP_200_OK,
            )
        # Si existe, y esta pendiente, avisamos que no puede solicitarla
        if request_object.state.id == 2:
            return Response(
                {"ok": False, "messages": ["Ya tiene una solicitud pendiente"],'data':{}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request_object.state.id == 3:
            # Si ya fue rechazada dos veces, informo que no se puede solicitar este trueque
            if request_object.rejected >= 2:
                return Response(
                    {
                        "ok": False,
                        "messages": [
                            "No se puede solicitar este trueque, ya fue rechazado dos veces"
                        ],
                        'data':{}
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # Si ya fue rechazada solo una vez, la paso a pendiente
            else:
                request_object.state = RequestState.objects.filter(id=2).first()
                request_object.post_maker.stock_product -= 1
                request_object.post_maker.save()
                request_object.save()
                return Response(
                    {
                        "ok": True,
                        "messages": ["Solicitud creada con éxito"],
                        "data": {"request": RequestSerializer(request_object).data},
                    },
                    status=status.HTTP_200_OK,
                )
        # Si ya fue aceptada, informo que no se puede solicitar este trueque
        return Response(
            {
                "ok": False,
                "messages": [
                    "Ya tienes una solicitud aceptada para este producto, no puedes solicitarlo nuevamente"
                ],
                'data':{}
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class RequestAccept(APIView):
    def post(self, request):
        data = request.data
        request_id = data['request_id']
        date_of_request = data['date_of_request']
        date = datetime.strptime(date_of_request, "%Y-%m-%d").date()

        request_object = Request.objects.filter(id=request_id).first()
        if request_object is None:
            return Response(
                {"ok": False, "messages": ["No se encontró la solicitud."], 'data':{}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        recieved = request_object.post_receive
        already_semi_accepted = Request.objects.filter(post_receive=recieved, state__id=4).exists()

        if already_semi_accepted:
            return Response(
                {"ok": False, "messages": ["Ya tienes un solicitud aceptada en proceso para este producto."], 'data':{}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Traigo todos los turnos que sean en esa filial y en esa fecha para evaluar si hay cupos disponibles.
        subsidiary_day_requests= Request.objects.filter(post_receive__subsidiary = request_object.post_receive.subsidiary,day_of_request=date, state__id__in =[1,4]).count()
        
        if subsidiary_day_requests >= 50:
            return Response(
                {"ok": False, "messages": ["No hay cupos disponibles para la filial en la fecha solicitada."], "data":{}},
                status=status.HTTP_400_BAD_REQUEST,
            )


        if request_object.post_receive.stock_product >= 1:
            request_object.state = RequestState.objects.filter(id=4).first()
            request_object.post_receive.stock_product -= 1
            request_object.rejected = 0
            request_object.day_of_request = date

            email = request_object.user_maker.email
            subsidiary_recieve = request_object.post_receive.subsidiary.name
            post_received_name = request_object.post_receive.name
            post_maker_name = request_object.post_maker.name
            user_receive_name = request_object.user_receive.full_name
            
            send_email_to_user(
                email= [email],
                subject='Solicitud aceptada.',
                message= f"¡Hola! {user_receive_name} ha aceptado tu solicitud de {post_maker_name} por el producto {post_received_name}." +
                            f"El intercambio se hace en la filial {subsidiary_recieve}, y {user_receive_name} propone el dia {date_of_request} para realizar el intercambio." +
                            f"Para aceptar o rechazar la solicitud, ingresa al siguiente link http://localhost:5173/evaluate-requests/{request_id}" +
                            "¡Gracias por confiar en swapit! :)"
            )
            request_object.post_receive.save()
            request_object.save()
            return Response(
                {"ok": True, "messages": ["Solicitud aceptada con éxito"], "data":{ "request": RequestSerializer(request_object).data}},
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "ok": True,
                "messages": [
                    "No puedes aceptar la solicitud, no tienes stock suficiente."
                ],
                'data':{}
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class RequestReject(APIView):
    def post(self, request):
        data = request.data
        request_id = data['request_id']
        request_object = Request.objects.filter(id=request_id).first()

        if request_object is None:
            return Response(
                {"ok": False, "messages": ["No se encontró la solicitud"], "data":{}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Se rechaza la solicitud
        request_object.state = RequestState.objects.filter(id=3).first()
        request_object.rejected += 1
        request_object.post_maker.stock_product += 1
        request_object.post_maker.save()
        request_object.save()
        return Response(
            {"ok": True, "messages": ["Solicitud rechazada con éxito"], 'data':{}},
            status=status.HTTP_200_OK,
        )
    
class RequestConfirm(APIView):
    def post(self, request):
        data = request.data
        request_id = data['request_id']
        user_maker_id = data['user_maker']

        request_object = Request.objects.filter(id=request_id, user_maker__id = user_maker_id).first()
        if request_object is None:
            return Response(
                {"ok": False, "messages": ["No se encontró la solicitud"], "data":{}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        decision = data['decision']

        
        if decision == 'accept': # Se acepta la solicitud
            email = request_object.user_receive.email
            send_email_to_user(
                email= [email],
                subject= 'Solicitud aceptada',
                message= f"¡Hola! {request_object.user_maker.full_name} ha aceptado tu solicitud de intercambio." +
                            f"El intercambio se realizará en la filial {request_object.post_receive.subsidiary.name} el día {request_object.day_of_request}." +
                            f"Para más información, contactate con {request_object.user_maker.full_name}." +
                            "¡Gracias por confiar en swapit! :)"
            )
            
            # NOTE: Todas las solicitudes al producto que recibe la solicitud se ponen en estado rechazado,
            #       sin incrementar los rechazos (se repone el stock de los otros productos ofertados).
            
            other_requests = Request.objects.filter(post_receive=request_object.post_receive).exclude(id=request_id)
            other_requests.update(state=RequestState.objects.filter(id=3).first())
            for other_request in other_requests:
                other_request.post_maker.stock_product += 1
                other_request.post_maker.save()
                other_request.save()

            # TODO: Crear un turno, con la informacion correspondiente.

            request_object.state = RequestState.objects.filter(id=1).first()
            request_object.save()
            return Response(
                {"ok": True, "messages": ["Solicitud confirmada con éxito"], 'data':{}},
                status=status.HTTP_200_OK,
            )
        elif decision == 'reject': # Se rechaza la solicitud
            email = request_object.user_receive.email
            send_email_to_user(
                email= [email],
                subject= 'Solicitud rechazada',
                message= f"¡Hola! {request_object.user_maker.full_name} ha rechazado tu solicitud de intercambio." +
                            f"Para más información, contactate con {request_object.user_maker.full_name}." +
                            "¡Gracias por confiar en swapit! :)"
            )

            # NOTE: Repongo el stock de ambos productos, y la solicitud pasa a un estado rechazado.
            request_object.post_maker.stock_product += 1
            request_object.post_receive.stock_product += 1
            request_object.post_maker.save()
            request_object.post_receive.save()
            request_object.state = RequestState.objects.filter(id=3).first()
            request.object.day_of_request = None
            request_object.save()

            return Response(
                {"ok": True, "messages": ["Solicitud rechazada con éxito"], 'data':{}},
                status=status.HTTP_200_OK,
            )
    
        return Response(
            {"ok": True, "messages": ["Error al procesar la solicitud"], 'data':{}},
            status=status.HTTP_400_BAD_REQUEST,
        )


class RequestMakedCancel(APIView):

    def post(self, request):
        data = request.data
        # Validar que solo esté en pendiente
        id_request = data["id_request"]

        request_object = Request.objects.filter(pk=id_request, state__in=[2, 4]).first()
        if request_object is None:
            return Response(
                {"ok": False, "messages": ["No se encontró la solicitud "], 'data':{}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Incrementar el stock en 1
        request_object.post_maker.stock_product += 1
        request_object.post_maker.save()

        if request_object.state.id == 4:
            request_object.post_receive.stock_product += 1
            request_object.post_receive.save()

        request_object.delete()
        return Response(
            {"ok": True, "messages": ["Solicitud rechazada con éxito"], 'data':{}},
            status=status.HTTP_200_OK,
        )


# -------------------- REQUEST STATE VIEW -------------------#


class ResquestStateVIEWs(generics.RetrieveUpdateDestroyAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer


class RequestStateCreateList(generics.ListCreateAPIView):
    queryset = RequestState.objects.all()
    serializer_class = RequestStateSerializer
