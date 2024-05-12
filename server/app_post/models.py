from django.db import models
from user.models import UserAccount
from subsidiary.models import Subsidiary
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"NAME {self.name} | ACTIVE {self.active}"


class PostState(models.Model):
    name = models.CharField(max_length=255)


class StateProduct(models.Choices):
    NEW = 'NUEVO'
    USED = 'USADO'
    DEFECTIVE = 'DEFECTUOSO'


class Post(models.Model):
    name = models.CharField(max_length=255, null=False)
    description = models.TextField(null=False)
    value = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], null=False)

    user = models.ForeignKey(
        UserAccount, on_delete=models.CASCADE, related_name='posts',
        null=False)
    subsidiary = models.ForeignKey(
        Subsidiary, on_delete=models.CASCADE, related_name='posts', null=False)

    state = models.ForeignKey(PostState,
                              default=2,
                              on_delete=models.DO_NOTHING,
                              related_name="posts")
    category = models.ForeignKey(Category,
                                 on_delete=models.DO_NOTHING,
                                 related_name="posts")

    state_product = models.CharField(
        max_length=10, choices=StateProduct.choices, null=False)

    image_1 = models.ImageField(
        upload_to='post_images/', null=False, blank=False)
    image_2 = models.ImageField(
        upload_to='post_images/', null=True, blank=True)
    image_3 = models.ImageField(
        upload_to='post_images/', null=True, blank=True)
    image_4 = models.ImageField(
        upload_to='post_images/', null=True, blank=True)
    image_5 = models.ImageField(
        upload_to='post_images/', null=True, blank=True)

    def __str__(self):
        return f"""

        NAME: {self.name}
        DESCRIPTION: {self.description}
        VALUE: {self.value}
        USER: {self.user}
        SUBSIDIARY: {self.subsidiary}
        STATE: {self.state}
        CATEGORY: {self.category}
        STATE PRODUCT: {self.state_product}
        IMAGES: {self.image_1} | {self.image_2} | {self.image_3} |
        {self.image_4} | {self.image_5}
        """
