import coreapi
from rest_framework.response import Response
from rest_framework import generics
from .models import Category, Post, PostState
from .serializer import (
    CategorySerializer, PostSerializer, PostStateSerializer)
from rest_framework.views import APIView
from rest_framework import status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.schemas import AutoSchema

# Format for the response:
# {
#     'ok': True,
#     'messages': [messageSuccess],
#     'data': {'modelName': serializer}
# }
# {
#     'ok': False,
#     'messages': [messageError],
#     'data': {}
# }


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

            category.active = False
            category.posts.filter(state=1).update(state=3)
            category.save()
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

            category.active = True
            category.posts.filter(state=3).update(state=1)
            category.save()
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


class PostDetails(generics.UpdateAPIView):

    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        return Category.objects.all()

    def partial_update(self, request, *args, **kwargs):
        try:
            values = dict(**request.data, **kwargs)
            id = values['id']
            post = Post.objects.filter(pk=id)
            if (post):
                post.update(**values)
                return Response({"Updated": f"{values} "})
            raise Exception("Post not found")
        except KeyError:
            return Response({"Falta ID, Parametros:", f"{values} "})
        except Exception:
            return Response({"Error de Atributos:", f"{values} "})


class PostCreate(generics.CreateAPIView):

    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def create(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class PostLists(generics.ListAPIView):

    def get_queryset(self):
        return Post.objects.all()

    serializer_class = PostSerializer
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

    def get_queryset(self):
        return Post.objects.filter(state_product='NUEVO')

    serializer_class = PostSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = [
        'name',
        'state_product',
        'state__name',
    ]
    search_fields = [
        'name',
    ]

    def list(self, request, id, *args, **kwargs):
        print("ID: ", id)
        # print("[QUERY PARAMS]:", request.query_params())
        queryset = (Post.objects
                    .exclude(user__id=id)
                    .filter(**request.GET))
        return Response(
            {
                'ok': True,
                'messages': ['Posts encontrados'],
                'data': {'posts': PostSerializer(queryset, many=True).data}
            },
            status=status.HTTP_200_OK
        )


class PostRemove(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def delete(self, request, *args, **kwargs):
        try:
            print("[KWARGS] ", kwargs)
            post = Post.objects.filter(pk=kwargs['pk'])
            post.update(state=2)
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
        serializer = PostStateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
