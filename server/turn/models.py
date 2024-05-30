from django.db import models
from app_post.models import Post
from subsidiary.models import Subsidiary
from user.models import UserAccount


class TurnState(models.Model):
    name = models.CharField(max_length=255)


class Turn(models.Model):
    code_maker = models.CharField(max_length=255)
    code_received = models.CharField(max_length=255)
    state = models.ForeignKey(TurnState, on_delete=models.DO_NOTHING)
    subsidiary = models.ForeignKey(Subsidiary, on_delete=models.DO_NOTHING)
    user_maker = models.ForeignKey(UserAccount,
                                   on_delete=models.DO_NOTHING,
                                   related_name='turns_made')
    user_received = models.ForeignKey(UserAccount,
                                      on_delete=models.DO_NOTHING,
                                      related_name='turns_received'
                                      )
    request = models.ForeignKey(Post,
                                on_delete=models.DO_NOTHING,
                                related_name='turns_made'
                                )
