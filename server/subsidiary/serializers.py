from rest_framework import serializers
from .models import Subsidiary

class SubsidiarySerializer(serializers.ModelSerializer):

    class Meta:
        model = Subsidiary
        fields = '__all__'
