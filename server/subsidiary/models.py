from django.db import models
from django.core.validators import MinValueValidator

class Subsidiary(models.Model):
    name = models.CharField(max_length=255, null=False)
    x_coordinate = models.CharField(max_length=255, null=False)
    y_coordinate = models.CharField(max_length=255, null=False)
    max_helpers = models.IntegerField(validators=[MinValueValidator(0)], default=3, null=False)
    active = models.BooleanField(default=True)