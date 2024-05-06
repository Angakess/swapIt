# Generar los serializadores para Category, PostState y Post.


from .models import Category
from rest_framework import serializers
from rest_framework.response import Response

# Serializador para la categoria 

class CategorySerializer(serializers.ModelSerializer):

    #funcion para listar todas las categorias. 

    def list(self, request):
        queryset = Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)
        return Response(queryset)


    class Meta:
        model = Category
        fields = '__all__'