from .models import Category, Post, PostState
from rest_framework import serializers


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
