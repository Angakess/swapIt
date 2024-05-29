from .models import Category, Post, PostState
from rest_framework import serializers
from user.serializers import UserCreatedSerializer, UserRequestSerializer
from subsidiary.serializers import SubsidiaryRequestSerializer, SubsidiarySerializer


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


class PostRequestSerializer(serializers.ModelSerializer):
    user = UserRequestSerializer()
    subsidiary = SubsidiaryRequestSerializer()
    category = serializers.SerializerMethodField('get_category_name')

    def get_category_name(self, obj):
        return obj.category.name

    class Meta:
        model = Post
        fields = [
            'id',
            'name',
            'description',
            'value',
            'user',
            'subsidiary',
            'category',
            'state_product',
            'image_1',
            'image_2',
            'image_3',
            'image_4',
            'image_5',
        ]
