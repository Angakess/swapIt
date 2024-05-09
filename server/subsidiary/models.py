from django.db import models

class Subsidiary(models.Model):
    name = models.CharField(max_length=255)
    x_coordinate = models.CharField(max_length=255)
    y_coordinate = models.CharField(max_length=255)
    active = models.BooleanField(default=True)