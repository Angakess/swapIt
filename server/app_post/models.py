from django.db import models


class Category(models.Model):
    id = models.IntegerField(auto_created=True, primary_key=True)
    name = models.CharField(max_length=255)


class PostState(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)


class Post(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=255, null=False)
    value = models.FloatField(null=False)
    id_state = models.ForeignKey(PostState, on_delete=models.CASCADE)
    id_category = models.ForeignKey(Category, on_delete=models.CASCADE)