from rest_framework import serializers
from app_post.serializer import PostBaseSerializer
from request.models import Request, RequestState


class RequestStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestState
        fields = "__all__"


class RequestSerializer(serializers.ModelSerializer):
    post_maker = PostBaseSerializer()
    post_receive = PostBaseSerializer()
    state = serializers.SerializerMethodField("get_state")

    def get_state(self, obj):
        return obj.state.name

    class Meta:
        model = Request
        fields = "__all__"


class RequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"


class RequestForListTurnSerializer(serializers.ModelSerializer):
    post_maker = PostBaseSerializer()
    post_receive = PostBaseSerializer()
    state = serializers.SerializerMethodField("get_state")

    def get_state(self, obj):
        return obj.state.name

    class Meta:
        model = Request
        exclude = ["user_maker", "user_receive"]


class RequestTurnDetailSerializer(serializers.ModelSerializer):
    post_maker = PostBaseSerializer()
    post_receive = PostBaseSerializer()

    class Meta:
        model = Request
        fields = ["id", "post_maker", "post_receive"]