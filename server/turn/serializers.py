from rest_framework import serializers
from .models import Turn
from subsidiary.serializers import SubsidiarySerializer
from user.serializers import UserSerializer
from request.serializers import RequestSerializer

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


class TurnSerializer(serializers.ModelSerializer):
    subsidiary = SubsidiarySerializer()
    user_maker = UserSerializer()
    user_received = UserSerializer()
    request = RequestSerializer()

    class Meta:
        model = Turn
        fields = "__all__"
