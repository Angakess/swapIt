
from rest_framework.response import Response
from rest_framework import generics

from app_post.custommixin import CategorySearchMixin

from .models import Category, Post, PostState
from .serializer import CategorySerializer, PostSerializer, PostStateSerializer
from rest_framework.views import APIView


class CategoryDetails(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.all()

    def retrieve(self, request, *args, **kwargs):
        id = kwargs['id']
        category = Category.objects.filter(pk=id)
        serializer = CategorySerializer(data=category.values(), many=True)
        return Response(serializer.initial_data)

    def destroy(self, request, *args, **kwargs):
        id = kwargs['id']
        post = Post.objects.filter(id_category=id)
        post.update(id_state=2)
        Category.objects.filter(pk=id).update(active=False)

        return Response({"Response": f"Category modify successfully \n"
                         f"Post modificaods {post.values()}"})


class CategoryCreate(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryList(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.all()

class PostOfCategory(APIView):
    def get(self, request, *args, **kwargs):
        category = Category.objects.filter(id=1).first()
        posts = category.posts
        serializer = PostSerializer(data=posts.values(), many=True)
        return Response(serializer.initial_data)

class CategorySearch(CategorySearchMixin, generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_url_kwarg = ['name']

    def get_queryset(self):
        return Category.objects.all()

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
        post.update(id_state=2)

        return Response({"Message": f"Post id:{pk}, id_state:{2} UwU CwC <3"})

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
    serializer_class = PostSerializer

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
