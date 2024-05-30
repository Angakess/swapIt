from subsidiary.models import Subsidiary

from django.contrib.auth import get_user_model
from .models import UserAccount, UserState
from rest_framework import serializers
from subsidiary.serializers import SubsidiaryWithCantHelpersSerializer, SubsidiarySerializer
User = get_user_model()


class UserStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserState
        fields = ['name']


class UserStateFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserState
        fields = '__all__'


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
            'rating'
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
    subsidiary = SubsidiaryWithCantHelpersSerializer(source='id_subsidiary')

    class Meta:
        model = UserAccount
        fields = [
            'id',
            'full_name',
            'dni',
            'subsidiary',
        ]


class ListExchangerSerializer(serializers.ModelSerializer):
    user_state = serializers.SerializerMethodField('get_user_state')

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
            'rating'
        ]


class HelperDetailSerializer(serializers.ModelSerializer):
    subsidiary = SubsidiarySerializer(source='id_subsidiary')

    class Meta:
        model = UserAccount
        fields = [
            'id',
            'full_name',
            'subsidiary',
        ]


class ExchangerDetailSerializer(serializers.ModelSerializer):
    state = UserStateFullSerializer()

    class Meta:
        model = UserAccount
        fields = [
            'id',
            'full_name',
            'dni',
            'email',
            'gender',
            'date_of_birth',
            'phone_number',
            'state'
        ]


class UserRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = [
            'first_name',
            'last_name',
            'dni',
            'email'
        ]
