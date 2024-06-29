from rest_framework import serializers
from .models import Rating
from user.serializers import UserOnlyNameSerializer, UserDetailSerializer

class RatingCreateSerializer(serializers.ModelSerializer):
    user_maker = UserDetailSerializer()
    user_received = UserDetailSerializer()
    
    class Meta:
        model = Rating
        fields = '__all__'

class RatingSerializer(serializers.ModelSerializer):
    user_maker = UserOnlyNameSerializer()

    class Meta:
        model = Rating
        fields = [
            'score',
            'comment',
            'user_maker'
        ]