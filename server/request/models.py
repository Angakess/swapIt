from django.db import models
from app_post.models import Post


class RequestState(models.Model):
    name = models.CharField(max_length=255, null=False)

    def __str__(self):
        return self.name


class Request(models.Model):
    post_maker = models.ForeignKey(Post, on_delete=models.DO_NOTHING,
                                   related_name='requests_send', null=False)
    post_receive = models.ForeignKey(Post, on_delete=models.DO_NOTHING,
                                     related_name='requests_receive', null=False)
    state = models.ForeignKey(RequestState, on_delete=models.DO_NOTHING,
                              related_name='requests')
