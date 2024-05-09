# Generar los serializadores para Category, PostState y Post.


from .models import *
from rest_framework import serializers

# Serializador para la categoria 

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class PostStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostState
        fields = '__all__'
