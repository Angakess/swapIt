from subsidiary.models import Subsidiary

from django.contrib.auth import get_user_model
from .models import UserAccount
from rest_framework import serializers
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    id_subsidiary = serializers.PrimaryKeyRelatedField(queryset=Subsidiary.objects.all(), required=False)

    class Meta:
        model = UserAccount
        fields = [
            'dni',
            'email',
            'gender',
            'date_of_birth',
            'phone_number',
            'id_subsidiary',
            'first_name',
            'last_name',
            'password',
            'role'
        ]

class UserCreatedSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = [
            'id',
            'first_name',
            'last_name',
            'dni',
            'email',
        ]