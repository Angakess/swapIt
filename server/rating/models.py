from django.db import models
from user.models import UserAccount


class Rating(models.Model):
    score = models.FloatField()
    comment = models.CharField(max_length=255)
    user_maker = models.ForeignKey(UserAccount,
                                   on_delete=models.DO_NOTHING,
                                   related_name='ratings_made'
                                   )
    user_received = models.ForeignKey(UserAccount,
                                      on_delete=models.DO_NOTHING,
                                      related_name='ratings_received'
                                      )
    checked = models.BooleanField(default=False)