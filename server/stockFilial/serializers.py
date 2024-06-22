from rest_framework import serializers
from app_post.serializer import CategorySerializer
from stockFilial.models import StockFilial
from subsidiary.serializers import SubsidiarySerializer

class StockFilialSerializer(serializers.ModelSerializer):
    categoria = CategorySerializer()
    subsidiary = SubsidiarySerializer()    

    class Meta:
        model = StockFilial
        fields = "__all__"