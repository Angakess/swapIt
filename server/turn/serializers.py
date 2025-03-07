from rest_framework import serializers
from .models import Turn, TurnState
from subsidiary.serializers import SubsidiarySerializer
from user.serializers import UserRequestSerializer
from request.serializers import RequestForListTurnSerializer, RequestSerializer
from app_post.serializer import PostBaseSerializer
# code_maker = models.CharField(max_length=255)
# code_received = models.CharField(max_length=255)
# state = models.ForeignKey(TurnState, on_delete=models.DO_NOTHING)
# subsidiary = models.ForeignKey(Subsidiary, on_delete=models.DO_NOTHING)
# user_maker = models.ForeignKey(
#     UserAccount, on_delete=models.DO_NOTHING, related_name="turns_made"
# )
# user_received = models.ForeignKey(
#     UserAccount, on_delete=models.DO_NOTHING, related_name="turns_received"
# )
# request = models.ForeignKey (
#     Post, on_delete=models.DO_NOTHING, related_name="turns_made"
# )


class TurnStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TurnState
        fields = "__all__"


class TurnSerializer(serializers.ModelSerializer):
    subsidiary = SubsidiarySerializer()
    user_maker = UserRequestSerializer()
    user_received = UserRequestSerializer()
    post_maker = PostBaseSerializer()
    post_receive = PostBaseSerializer()
    state = TurnStateSerializer()

    class Meta:
        model = Turn
        fields = "__all__"


class TurnExchangerListSerializer(serializers.ModelSerializer):
    post_maker = PostBaseSerializer()
    post_receive = PostBaseSerializer()

    class Meta:
        model = Turn
        fields = ["id", "post_maker", "post_receive", "day_of_turn"]


class TurnHelperListSerializer(serializers.ModelSerializer):
    user_maker = UserRequestSerializer()
    user_received = UserRequestSerializer()

    class Meta:
        model = Turn
        fields = ["id", "user_maker", "user_received", "state"]


class TurnDetailSerializer(serializers.ModelSerializer):
    post_maker = PostBaseSerializer()
    post_receive = PostBaseSerializer()
    
    class Meta:
        model = Turn
        fields = [
            'id',
            'post_maker',
            'post_receive',
            'day_of_turn'
        ]
# [
#     {
#         "id": 3,
#         "user_maker": {
#             "first_name": "Rena",
#             "last_name": "Longcake",
#             "dni": "23309342",
#         },
#         "user_received": {
#             "first_name": "Jacquelynn",
#             "last_name": "Gettings",
#             "dni": "11153471",
#         },
#         "state": 1
#     }
# ]
