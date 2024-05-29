from rest_framework import serializers
from .models import Subsidiary


class SubsidiaryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subsidiary
        fields = [
            'name',
            'x_coordinate',
            'y_coordinate',
        ]


class SubsidiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subsidiary
        fields = [
            'id',
            'name',
            'x_coordinate',
            'y_coordinate',
            'max_helpers',
            'cant_current_helpers',
            'active',
        ]


class SubsidiaryWithCantHelpersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subsidiary
        fields = ['name', 'cant_current_helpers']
