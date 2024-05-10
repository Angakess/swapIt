from django.db import models
from user.models import UserAccount


class Category(models.Model):
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"NAME {self.name} | ACTIVE {self.active}"


class PostState(models.Model):
    name = models.CharField(max_length=255)


class Post(models.Model):
    name = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=255, null=False)
    value = models.FloatField(null=False)
    stateProduct = models.CharField(max_length=255, null=False)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='posts')
    id_state = models.ForeignKey(PostState,
                                 on_delete=models.DO_NOTHING, related_name="posts")
    id_category = models.ForeignKey(Category,
                                    on_delete=models.DO_NOTHING, related_name="posts")
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"""Name: {self.name},
        Description: {self.description},
        Value: {self.value},
        StateProduct: {self.stateProduct},
        Id_state: {self.id_state},
        Id_category: {self.id_category}"""
