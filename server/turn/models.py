from django.db import models
from subsidiary.models import Subsidiary
from user.models import UserAccount
from app_post.models import Post


class TurnState(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"({self.id}) {self.name}" 


class Turn(models.Model):
    code_maker = models.CharField(max_length=255)
    code_received = models.CharField(max_length=255)
    state = models.ForeignKey(TurnState, on_delete=models.DO_NOTHING)
    subsidiary = models.ForeignKey(Subsidiary, on_delete=models.DO_NOTHING)
    user_maker = models.ForeignKey(
        UserAccount, on_delete=models.DO_NOTHING, related_name="turns_made"
    )
    user_received = models.ForeignKey(
        UserAccount, on_delete=models.DO_NOTHING, related_name="turns_received"
    )

    post_maker = models.ForeignKey(Post, on_delete=models.DO_NOTHING,
                                   related_name='turns_send', null=True, blank=True)

    post_receive = models.ForeignKey(Post, on_delete=models.DO_NOTHING,
                                     related_name='turns_receive', null=True, blank=True)

    day_of_turn = models.DateField(null=True,blank=True)
