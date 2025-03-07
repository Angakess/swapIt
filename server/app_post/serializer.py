from .models import Category, Post, PostState
from rest_framework import serializers
from user.serializers import UserCreatedSerializer
from subsidiary.serializers import SubsidiarySerializer


class CategoryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class PostStateRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostState
        fields = ['name']


class PostStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostState
        fields = '__all__'


class PostBaseSerializer(serializers.ModelSerializer):
    user = UserCreatedSerializer()
    subsidiary = SubsidiarySerializer()
    state = PostStateSerializer()
    category = CategorySerializer()

    class Meta:
        model = Post
        fields = [
            'id',
            'name',
            'description',
            'value',
            'user',
            'subsidiary',
            'state',
            'category',
            'state_product',
            'stock_product',
            'image_1',
            'image_2',
            'image_3',
            'image_4',
            'image_5',
        ]
