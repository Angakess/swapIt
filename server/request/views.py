from rest_framework import generics, filters, status
from request.models import Request, RequestState
from request.serializer import RequestSerializer, RequestStateSerializer, RequestCreateSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from user.models import UserAccount
from app_post.models import Post
from .models import RequestState
from rest_framework.response import Response



class RequestList(generics.ListAPIView):

    def get_queryset(self):
        return Request.objects.all()

    serializer_class = RequestSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = [
        'state__name',
        'post_maker',
        'post_receive',
        'post_maker__user__dni',
        'post_receive__user__dni',
    ]


class RequestCreate(APIView):
    #NOTE: No me fijo si el producto que ofrezco tiene stock, porque no debemos listarle productos sin stock para ofrecer.
    def post(self, request):
        data = request.data
        id_user_maker = data['user_maker']
        id_post_maker = data['post_maker']
        id_user_receive = data['user_receive']
        id_post_receive = data['post_receive']
        
        request_object = Request.objects.filter(user_maker__id=id_user_maker, post_maker__id = id_post_maker, user_receive__id=id_user_receive, post_receive__id=id_post_receive).first()

        # Si no existe, creo la solicitud
        if request_object is None:
            user_maker = UserAccount.objects.filter(id=id_user_maker).first()
            post_maker = Post.objects.filter(id=id_post_maker).first()
            user_receive = UserAccount.objects.filter(id=id_user_receive).first()
            post_receive = Post.objects.filter(id=id_post_receive).first()
            state = RequestState.objects.filter(id=2).first()
            
            #Restamos el stock
            post_maker.stock_product -= 1
            post_maker.save()

            request_created = Request.objects.create(
                post_maker=post_maker,
                post_receive=post_receive,
                user_maker=user_maker,
                user_receive=user_receive,
                state=state
            )
            request_created.save()
            return Response(
                    {
                        'ok': True,
                        'messages': ['Solicitud creada con éxito'],
                        'data': {'Request': RequestSerializer(request_created).data}
                    },
                    status=status.HTTP_200_OK
                )
        # Si existe, y esta pendiente, avisamos que no puede solicitarla
        if request_object.state.id == 2:
            return Response(
                {
                    'ok': False,
                    'messages': ['Ya tiene una solicitud pendiente']
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
        if request_object.state.id == 3:
            # Si ya fue rechazada dos veces, informo que no se puede solicitar este trueque
            if request_object.rejected >=2:
                return Response(
                    {
                        'ok': False,
                        'messages': ['No se puede solicitar este trueque, ya fue rechazado dos veces']
                    },
                    status=status.HTTP_400_BAD_REQUEST
                ) 
            # Si ya fue rechazada solo una vez, la paso a pendiente
            else:
                request_object.state = RequestState.objects.filter(id=2).first()
                request_object.post_maker.stock_product -= 1
                request_object.post_maker.save()
                request_object.save()
                return Response(
                    {
                        'ok': True,
                        'messages': ['Solicitud creada con éxito'],
                        'data': {'Request': RequestSerializer(request_object).data}
                    },
                    status=status.HTTP_200_OK
                )
        # Si ya fue aceptada, informo que no se puede solicitar este trueque
        return Response(
            {
                'ok': False,
                'messages': ['Ya tienes una solicitud aceptada para este producto, no puedes solicitarlo nuevamente']
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class RequestAccept(APIView):
    def post(self, request):
        data = request.data
        id_user_maker = data['user_maker']
        id_post_maker = data['post_maker']
        id_user_receive = data['user_receive']
        id_post_receive = data['post_receive']

        request_object = Request.objects.filter(user_maker__id=id_user_maker, post_maker__id = id_post_maker, user_receive__id=id_user_receive, post_receive__id=id_post_receive).first()

        if request_object is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['No se encontró la solicitud.']
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # TODO: Crear turno para esta solicitud aceptada
        # TODO: Crear la logica de la aceptacion de fechas y demas.
        # Semi aceptacion del intercambio
        if request_object.post_receive.stock_product >= 1:
            request_object.state = RequestState.objects.filter(id=4).first()
            request_object.post_receive.stock_product -= 1
            request_object.post_receive.save()
            request_object.rejected = 0
            request_object.save()
            return Response(
                {
                    'ok': True,
                    'messages': ['Solicitud aceptada con éxito']
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                'ok': True,
                'messages': ['No puedes aceptar la solicitud, no tienes stock suficiente.']
            },
            status=status.HTTP_400_BAD_REQUEST
        )

class RequestReject(APIView):
    def post(self, request):
        data = request.data
        id_user_maker = data['user_maker']
        id_post_maker = data['post_maker']
        id_user_receive = data['user_receive']
        id_post_receive = data['post_receive']

        request_object = Request.objects.filter(user_maker__id=id_user_maker, post_maker__id = id_post_maker, user_receive__id=id_user_receive, post_receive__id=id_post_receive).first()

        if request_object is None:
            return Response(
                {
                    'ok': False,
                    'messages': ['No se encontró la solicitud']
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        # Se rechaza la solicitud
        request_object.state = RequestState.objects.filter(id=3).first()
        request_object.rejected += 1
        request_object.post_maker.stock_product += 1
        request_object.post_maker.save()
        request_object.save()
        return Response(
            {
                'ok': True,
                'messages': ['Solicitud rechazada con éxito']
            },
            status=status.HTTP_200_OK
        )


# -------------------- REQUEST STATE VIEW -------------------#

class ResquestStateVIEWs(generics.RetrieveUpdateDestroyAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer


class RequestStateCreateList(generics.ListCreateAPIView):
    queryset = RequestState.objects.all()
    serializer_class = RequestStateSerializer
