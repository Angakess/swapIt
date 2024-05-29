from rest_framework import generics
from request.models import Request, RequestState
from request.serializer import RequestSerializer, RequestStateSerializer


class RequestList(generics.ListAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer


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
