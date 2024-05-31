from rest_framework import serializers
from app_post.serializer import PostRequestSerializer
from request.models import Request, RequestState


class RequestStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestState
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    post_maker = PostRequestSerializer()
    post_receive = PostRequestSerializer()
    state = serializers.SerializerMethodField('get_state')

    def get_state(self, obj):
        return obj.state.name

    class Meta:
        model = Request
        fields = '__all__'

class RequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'