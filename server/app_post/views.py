
""" This module contains the views for the app_post blueprint."""
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action
from .models import Category, Post, PostState
from .serializer import CategorySerializer, PostSerializer, PostStateSerializer



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

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def list(self, request):
        queryset = Post.objects.all()
        print(queryset)
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)


    def create(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def update(self, request, pk=None):
        post = Post.objects.filter(pk=pk)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def remove(self, request, pk=None):
        post = Post.objects.filter(pk=pk)
        post.delete()
        return Response(status=204)



    @action(detail=False, methods=['get'],
            url_path="filtres/(?P<id_category>[^/.]+)/(?P<product_state>[^/.]+)",)
    def get_posts(self, request, id_category=None, product_state=None):
        """ Obtener los posts de una categoria con el estado de producto especificado si es que se especifica."""
        print("[CATEGORY]: ", type(id_category))
        print("[STATE]: ", product_state)
        if( id_category == "0" and product_state == "all"):
            print("ENTRO")
            posts = Post.objects.all()
        elif id_category == "0":
            posts = Post.objects.filter(stateProduct=product_state.capitalize())
        elif product_state == "all":
            posts = Post.objects.filter(id_category=id_category)
        else:
            posts = Post.objects.filter(id_category=id_category, stateProduct=product_state.capitalize())

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    ### REVISAR SI QUEDAN LOS DE ABAJO
    
    # DEFINIR post filtrado por categoria
    @action(detail=True, methods=['get'])
    def list_by_category(self, request, pk=None):
        posts = Post.objects.filter(id_category=pk)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
    # DEFINIR lista post id_state=1
    @action(detail=False, methods=['get'],
            url_path="enabled",)
    def list_enabled_posts(self, _request):
        posts = Post.objects.filter(id_state=1)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'],
            url_path="enabled/category/(?P<id_category>[^/.]+)",)
    def list_enabled_posts_by_category(self, _request, id_category=None):
        if id_category == 0 :
            posts = Post.objects.filter(id_state=1)
        else:
            posts = Post.objects.filter(id_state=1, id_category=id_category)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], 
        url_path="products/(?P<state>[^/.]+)",)
    def list_by_state_product(self, _request, state):
        posts = Post.objects.filter(stateProduct=state.capitalize())
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'],
            url_path="products/states",)
    def get_products_states(self, _request):
        states = Post.objects.values('stateProduct').distinct()
        return Response(states)


class PostStateViewSet(viewsets.ModelViewSet):
    serializer_class = PostStateSerializer
    queryset = PostState.objects.all()

    def list(self, request):
        queryset = PostState.objects.all()
        serializer = PostStateSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = PostStateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def update(self, request, pk=None):
        post_state = PostState.objects.filter(pk=pk)
        serializer = PostStateSerializer(post_state, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def remove(self, request, pk=None):
        post_state = PostState.objects.filter(pk=pk)
        post_state.delete()
        return Response(status=204)