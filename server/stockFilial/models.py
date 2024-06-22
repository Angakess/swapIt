from django.db import models
from app_post.models import Category
from subsidiary.models import Subsidiary

class StockFilial(models.Model):
    cantidad = models.IntegerField(default=0)
    categoria = models.ForeignKey(Category, on_delete=models.DO_NOTHING,
                                   related_name='stock_in_filial', null=False)
    filial = models.ForeignKey(Subsidiary, on_delete=models.DO_NOTHING,
                               related_name='stock', null=False)
    