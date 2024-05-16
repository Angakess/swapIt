import itertools
import coreapi
from rest_framework.response import Response
from rest_framework import generics


from .models import Category, Post, PostState
from .serializer import (
    CategorySerializer, PostSerializer, PostBaseSerializer, PostStateSerializer)
from rest_framework.views import APIView
from rest_framework import status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.schemas import AutoSchema

# Format for the response:
# ({
#     'ok': True,
#     'messages': [messageSuccess],
#     'data': {'modelName': serializer}
# }, status=status.
# )
# ({
#     'ok': False,
#     'messages': [messageError],
#     'data': {}
# }, status=status.
# )


class CategoryRemove(APIView):

    schema = AutoSchema(manual_fields=[
        coreapi.Field("pk", required=True, location="form",
                      description="ID de la categoria a pausar")
    ])

    def delete(self, request):
        try:
            pk = request.data['pk']
            category = Category.objects.filter(pk=pk).first()
            if (not category):
                return Response({
                    'ok': False,
                    'messages': ['Categoria no encontrada'],
                    'data': {}
                }, status=status.HTTP_404_NOT_FOUND)

            category.deactivate()

            return Response(
                {
                    'ok': True,
                    'messages': ['Categoria eliminada exitosamente'],
                    'data': {'category': CategorySerializer(category).data}
                },
                status=status.HTTP_200_OK
            )
        except KeyError:
            return Response({
                'ok': False,
                'messages': ['Falta ID'],
                'data': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class CategoryRestore(APIView):

    schema = AutoSchema(manual_fields=[
        coreapi.Field("pk", required=True, location="form",
                      description="ID de la categoria a restaurar")
    ])

    def put(self, request):
        try:
            pk: int = request.data['pk']
            category = Category.objects.filter(pk=pk).first()
            if (not category):
                return Response({
                    'ok': False,
                    'messages': ['Categoria no encontrada'],
                    'data': {}
                }, status=status.HTTP_404_NOT_FOUND)

            category.reactivate()

            return Response(
                {
                    'ok': True,
                    'messages': ['Categoria restaurada exitosamente'],
                    'data': {'category': CategorySerializer(category).data}
                },
                status=status.HTTP_200_OK
            )
        except KeyError:
            return Response({
                'ok': False,
                'messages': ['Falta ID'],
                'data': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class CategoryCreate(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryUpdate(generics.UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryList(generics.ListAPIView):

    def get_queryset(self):
        return Category.objects.all()

    def list(self, request, *args, **kwargs):
        list = super().list(request, *args, **kwargs)
        if (len(list.data) == 0):
            return Response({
                'ok': False,
                'messages': ["No hay categorías disponibles"],
                'data': {}
            }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'ok': True,
            'messages': [f'Categorias {"encontradas"}'],
            'data': {'categories': list.data}
        },
            status=status.HTTP_200_OK)

    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = [
        'active'
    ]
    search_fields = [
        '^name',
    ]


# ----------------------POST----------------------


class PostUpdate(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        return Category.objects.all()

    def partial_update(self, request, *args, **kwargs):
        print("[partial_update][KWARGS] ", kwargs)
        print("[partial_update][REQUEST] ", request.data)
        return super().partial_update(request, *args, **kwargs)


class PostRetrieve(generics.RetrieveAPIView):

    queryset = Post.objects.all()
    serializer_class = PostBaseSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'ok': True,
            'messages': ['Post encontrado'],
            'data': {'post': serializer.data}
        }, status=status.HTTP_200_OK)


class PostCreate(generics.CreateAPIView):

    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def create(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'ok': True,
                'messages': ['Post creado exitosamente'],
                'data': {'post': serializer.data}
            }, status=status.HTTP_201_CREATED)
        return Response({
            'ok': False,
            'messages': list(itertools.chain(*serializer.errors.values())),
            'data': {}
        }, status=status.HTTP_406_NOT_ACCEPTABLE)


class PostLists(generics.ListAPIView):

    def get_queryset(self):
        return Post.objects.all()

    serializer_class = PostBaseSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = [
        'name',
        'state_product',
        'state__name',
        'category__name',
        'user__id',
        'user__first_name'
    ]
    search_fields = [
        'name',
    ]


class PostListsExchanger(generics.ListAPIView):
    """ Post list execpt id exchenger"""

    def get_queryset(self):
        user_id = self.kwargs.get('id')
        return Post.objects.exclude(user__id=user_id)

    serializer_class = PostBaseSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = [
        'state_product',
        'state__name',
        'category__name',
    ]
    search_fields = [
        'name',
    ]


class PostRemove(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def delete(self, request, *args, **kwargs):
        try:
            print("[KWARGS] ", kwargs)
            post = Post.objects.filter(pk=kwargs['pk'])
            post.update(state=5)
            # Agregar cancelación de peticiones
            return Response(
                {
                    'ok': True,
                    'messages': ['Post eliminado exitosamente'],
                    'data': {'post': PostSerializer(post.first()).data}
                }, status=status.HTTP_200_OK
            )
        except KeyError:
            return Response({
                'ok': False,
                'messages': ['Falta ID'],
                'data': {}
            }, status=status.HTTP_400_BAD_REQUEST)


# ----------------------POST STATE----------------------


class PostStateList(generics.ListAPIView):
    serializer_class = PostStateSerializer

    def get_queryset(self):
        return PostState.objects.all()


class PostStateCreate(generics.CreateAPIView):
    queryset = PostState.objects.all()
    serializer_class = PostStateSerializer

    def create(self, request):
        if (PostState.objects.filter(name=request.data['name']).exists()):
            return Response(
                {
                    'ok': False,
                    'messages': ['El estado ya existe'],
                    'data': {}
                }, status=status.HTTP_406_NOT_ACCEPTABLE
            )
        serializer = PostStateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'ok': True,
                    'messages': ['Estado creado exitosamente'],
                    'data': {'post_state': serializer.data}
                }, status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'ok': False,
                'messages': ['Error al crear el estado'],
                'data': {serializer.errors}
            }, status=status.HTTP_406_NOT_ACCEPTABLE
        )
