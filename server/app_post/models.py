from django.db import models
from user.models import UserAccount
from subsidiary.models import Subsidiary
from django.core.validators import MinValueValidator, MaxValueValidator
from common.email import send_email_to_user


class Category(models.Model):
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    def deactivate(self):
        posts  = self.posts.filter(state__id__in=[1, 2])
        unique_emails = list(posts.values_list('user__email', flat=True).distinct())
        send_email_to_user(
            email=unique_emails,
            subject='Pausa temporal de la categoria ' + self.name,
            message= 'La categoria ' + self.name + 
                ' ha sido pausada temporalmente, todas sus publicaciones relacionadas con esta categoría quedarán suspendidas temporalmente.'
                + ' Para que su publicación sea visible nuevamente, seleccione una nueva categoría. \n'
        )
        posts.update(state=3)
        self.active = False 
        self.save()

    def reactivate(self):
        posts  = self.posts.filter(state__id=3)
        unique_emails = list(posts.values_list('user__email', flat=True).distinct())
        send_email_to_user(
            email=unique_emails,
            subject='Reactivación de la categoría ' + self.name,
            message= 'La categoría ' + self.name + 
                ' ha sido reactivada, todas sus publicaciones relacionadas con esta categoría que estén en estado suspendido, se reactivaran nuevamente.' + 
                ' Las publicaciones reactivadas son visibles nuevamente. \n'
        )
        posts.update(state=1)
        self.active = True 
        self.save()


class PostState(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class StateProduct(models.Choices):
    NEW = 'NUEVO'
    USED = 'USADO'
    DEFECTIVE = 'DEFECTUOSO'


class Post(models.Model):
    name = models.CharField(max_length=255, null=False)
    description = models.TextField(null=False)
    value = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], null=False)
    stock_product = models.IntegerField(default=1, null=False,
                                        validators=[MinValueValidator(1),
                                                    MaxValueValidator(100)],)

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
        return self.name
