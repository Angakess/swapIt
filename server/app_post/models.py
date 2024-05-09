from django.db import models


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
    id_state = models.ForeignKey(PostState,
                                 on_delete=models.DO_NOTHING)
    id_category = models.ForeignKey(Category,
                                    on_delete=models.DO_NOTHING)

    def __str__(self):
        return f"""Name: {self.name},
        Description: {self.description},
        Value: {self.value},
        StateProduct: {self.stateProduct},
        Id_state: {self.id_state},
        Id_category: {self.id_category}"""
