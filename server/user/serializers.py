from subsidiary.models import Subsidiary

from django.contrib.auth import get_user_model
from .models import UserAccount, UserState
from rest_framework import serializers
from subsidiary.serializers import SubsidiaryWithCantHelpersSerializer
User = get_user_model()

class UserStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserState
        fields = ['name']

class UserSerializer(serializers.ModelSerializer):
    id_subsidiary = serializers.PrimaryKeyRelatedField(
        queryset=Subsidiary.objects.all(), required=False)

    class Meta:
        model = UserAccount
        fields = [
            'first_name',
            'last_name',
            'dni',
            'email',
            'gender',
            'date_of_birth',
            'phone_number',
            'password',
            'role',
            'id_subsidiary',
        ]


class UserCreatedSerializer(serializers.ModelSerializer):
    state = UserStateSerializer()

    class Meta:
        model = UserAccount
        fields = [
            'id',
            'first_name',
            'last_name',
            'dni',
            'email',
            'role',
            'state'
        ]
    
class ListHelperSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField('get_full_name')
    subsidiary = SubsidiaryWithCantHelpersSerializer(source='id_subsidiary')

    def get_full_name(self, obj):
        return obj.first_name + ' ' + obj.last_name
    

    def get_subsidiary_name(self, obj):
        return obj.id_subsidiary.name

    class Meta:
        model = UserAccount
        fields = [
            'id',
            'full_name',
            'dni',
            'subsidiary',
        ]


class ListExchangerSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField('get_full_name')
    user_state = serializers.SerializerMethodField('get_user_state')

    def get_full_name(self, obj):
        return obj.first_name + ' ' + obj.last_name
    

    def get_user_state(self, obj):
        return obj.state.name

    class Meta:
        model = UserAccount
        fields = [
            'id',
            'full_name',
            'dni',
            'email',
            'user_state',
        ]
