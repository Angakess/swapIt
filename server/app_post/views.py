from rest_framework.response import Response
from rest_framework import generics
from .models import Category, Post, PostState
from .serializer import (CategorySerializer, PostSerializer,
                         PostStateSerializer, PostBaseSerializer)
from rest_framework.views import APIView
from rest_framework import status


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
            category.posts.all().update(state=2)
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
            category.posts.all().update(state=1)
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


class CategoryList(APIView):

    def get(self, request, state):
        if (state != 'active' and state != 'inactive'):
            return Response({
                'ok': False,
                'messages': ['Estado invalido'],
                'data': {}
            },
                status=status.HTTP_400_BAD_REQUEST
            )
        queryset = Category.objects.filter(active=(state == 'active'))
        if (not queryset):
            return Response({
                'ok': False,
                'messages': ['Categorias no encontradas'],
                'data': {}
            },
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CategorySerializer(queryset, many=True)
        return Response({
            'ok': True,
            'messages': ['Categorias encontradas exitosamente'],
            'data': {'categories': serializer.data}
        },
            status=status.HTTP_200_OK
        )


class CategorySearch(APIView):

    def get(self, request, name):

        queryset = Category.objects.filter(name__icontains=name)
        if (not queryset):
            return Response({
                'ok': False,
                'messages': ['Categoria no encontrada'],
                'data': {}
            },
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CategorySerializer(data=queryset.values(), many=True)
        return Response({
            'ok': True,
            'messages': ['Categoria encontrada exitosamente'],
            'data': {'category': serializer.initial_data}
        },
            status=status.HTTP_200_OK)

    # ----------------------POST----------------------


class PostDetails(generics.RetrieveUpdateDestroyAPIView):
    """
    get:
    Return a Post instance.

    patch:

    - Para actualizar cualquier campo se debe enviar la clave, y el valor
    junto con el id. Ejemplo:
    {
        "id": 1,
        "name": "Nuevo Nombre"
    }
    """

    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        return Category.objects.all()

    def destroy(self, request, *args, **kwargs):
        pk = kwargs['pk']
        post = Post.objects.filter(pk=pk)
        post.update(state=2)

        return Response({"Message": f"Post id:{pk}, state:{2} UwU CwC <3"})

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


class PostList(generics.ListAPIView):
    serializer_class = PostBaseSerializer

    def get_queryset(self):
        return Post.objects.all()


class PostCreate(generics.CreateAPIView):

    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def create(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


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
