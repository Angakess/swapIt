from rest_framework import serializers
from .models import Subsidiary

class SubsidiarySerializer(serializers.ModelSerializer):

    class Meta:
        model = Subsidiary
        fields = '__all__'

class SubsidiaryWithCantHelpersSerializer(serializers.ModelSerializer):
    cant_helpers = serializers.SerializerMethodField('get_cant_helpers')

    def get_cant_helpers(self, obj):
        return obj.users.count()

    class Meta:
        model = Subsidiary
        fields = ['name', 'cant_helpers']
