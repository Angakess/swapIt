from rest_framework import generics
from request.models import Request, RequestState
from request.serializer import RequestSerializer, RequestStateSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend


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


class RequestCreate(generics.CreateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer


# -------------------- REQUEST STATE VIEW -------------------#

class ResquestStateVIEWs(generics.RetrieveUpdateDestroyAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer


class RequestStateCreateList(generics.ListCreateAPIView):
    queryset = RequestState.objects.all()
    serializer_class = RequestStateSerializer
