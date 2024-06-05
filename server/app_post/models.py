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
        posts  = self.posts.filter(state__id__in=[1, 2, 7])
        unique_emails = list(posts.values_list('user__email', flat=True).distinct())
        try:
            send_email_to_user(
                email=unique_emails,
                subject='Pausa temporal de la categoria ' + self.name,
                message= 'La categoria ' + self.name + 
                    ' ha sido pausada temporalmente, todas sus publicaciones relacionadas con esta categoría quedarán suspendidas temporalmente.'
                    + ' Para que su publicación sea visible nuevamente, seleccione una nueva categoría. \n'
            )

            #NOTE: Esto es muy feo y se puede modulizar y optimizar, pero el que juzga murio en la cruz.
            for post in posts:
                requests_send = post.posts_send.filter(state__id__in=[2,4])
                emails_received = list(requests_send.values_list('user_receive__email', flat=True).distinct())

                requests_receive = post.posts_receive.filter(state__id__in=[2,4])
                emails_send = list(requests_receive.values_list('user_maker__email', flat=True).distinct())

                turns_send = post.turns_send.filter(state__id=1)
                emails_turns_send = list(turns_send.values_list('user_received__email', flat=True).distinct())

                turns_receive = post.turns_receive.filter(state__id=1)
                emails_turns_receive = list(turns_receive.values_list('user_maker__email', flat=True).distinct())


                emails = emails_received + emails_send + emails_turns_send + emails_turns_receive
                emails_set = set(emails)
                emails = list(emails_set)

                send_email_to_user(
                    email=emails,
                    subject='Publicación suspendida',
                    message='La publicación ' + post.name + ' ha sido suspendida debido a que la categoria ' + self.name + ' ha sido pausada temporalmente. \n' +
                        'Todos las solicitudes y turnos pendientes relacionados a esta publicación seran cancelados. \n' +
                        'Disculpe las molestias ocasionadas. \n' +
                        'Saludos, el equipo de SwapIT. \n'
                )
        except Exception as e:
            print(e)
            return False

        for post in posts:
            post.posts_send.filter(state__id__in=[2,4]).update(state=3)
            post.posts_receive.filter(state__id__in=[2,4]).update(state=3)

            turns_made = post.turns_send.filter(state__id=1)
            turns_receive = post.turns_receive.filter(state__id=1)

            for turn in turns_made:
                if turn.post_maker.stock_product == 0 and turn.post_maker.state.id == 7:
                    turn.post_maker.state= PostState.objects.get(id=1)

                if turn.post_receive.stock_product == 0 and turn.post_receive.state.id == 7:
                    turn.post_receive.state= PostState.objects.get(id=1)

                turn.post_maker.stock_product += 1
                turn.post_receive.stock_product += 1
                turn.post_maker.save()
                turn.post_receive.save()

        
            for turn in turns_receive:
                if turn.post_maker.stock_product == 0 and turn.post_maker.state.id == 7:
                    turn.post_maker.state = PostState.objects.get(id=1)

                if turn.post_receive.stock_product == 0 and turn.post_receive.state.id == 7:
                    turn.post_receive.state= PostState.objects.get(id=1)

                turn.post_maker.stock_product += 1
                turn.post_receive.stock_product += 1
                turn.post_maker.save()
                turn.post_receive.save()

            turns_made.delete()
            turns_receive.delete()
            
        posts.update(state=3)
        self.active = False 
        self.save()
        return True

    def reactivate(self):
        posts  = self.posts.filter(state__id=3)
        unique_emails = list(posts.values_list('user__email', flat=True).distinct())
        try:
            send_email_to_user(
                email=unique_emails,
                subject='Reactivación de la categoría ' + self.name,
                message= 'La categoría ' + self.name + 
                    ' ha sido reactivada, todas sus publicaciones relacionadas con esta categoría que estén en estado suspendido, se reactivaran nuevamente.' + 
                    ' Las publicaciones reactivadas son visibles nuevamente. \n'
            )
        except Exception as e:
            print(e)
            return False
        posts.update(state=1)
        self.active = True 
        self.save()
        return True



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
