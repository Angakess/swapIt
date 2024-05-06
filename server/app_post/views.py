
""" This module contains the views for the app_post blueprint."""
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Category, Post
from .serializer import CategorySerializer


# Crear las vistas para el modelo Category, PostState y Post
# De las vistas Category: Listar, Crear, Actualizar, Eliminar.

class CategoryViewSet(viewsets.ModelViewSet):

    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    def list(self, request):
        queryset = Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)


    def create(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


    def update(self, request, pk=None):
        category = Category.objects.filter(pk=pk)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def remove(self, request, pk=None):
        category = Category.objects.filter(pk=pk)
        category.delete()
        posts = Post.objects.filter(id_category=pk)
        posts.delete()
        return Response(status=204)