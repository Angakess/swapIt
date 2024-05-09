from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import Subsidiary
from .serializers import SubsidiarySerializer
from user.models import UserAccount

class SubsidiaryDetails(generics.RetrieveUpdateDestroyAPIView):

    def get_queryset(self):
        return Subsidiary.objects.all()

    def destroy(self, request, *args, **kwargs):
        pk = kwargs['pk']
        cant_helpers = UserAccount.objects.filter(id_subsidiary=pk).count()
        if (cant_helpers>0):
            return Response({"message": "We can't delete this branch, it has assigned helpers."}, 
                        status=403)
        
        Subsidiary.objects.filter(pk=pk).update(active=False)
        return Response({"message": "Subsidiary modify successfully"}, 
                        status=204)

    serializer_class = SubsidiarySerializer


class SubsidiaryCreate(generics.CreateAPIView):
    queryset = Subsidiary.objects.all()
    serializer_class = SubsidiarySerializer


class SubsidiaryList(generics.ListAPIView):
    def get_queryset(self):
        return Subsidiary.objects.all()

    serializer_class = SubsidiarySerializer
