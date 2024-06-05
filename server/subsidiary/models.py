from django.db import models
from django.core.validators import MinValueValidator
from common.email import send_email_to_user


class Subsidiary(models.Model):
    name = models.CharField(unique=True,max_length=255, null=False)
    x_coordinate = models.CharField(max_length=255, null=False)
    y_coordinate = models.CharField(max_length=255, null=False)
    max_helpers = models.IntegerField(
        validators=[MinValueValidator(0)], default=3, null=False)
    active = models.BooleanField(default=False)

    @property
    def cant_current_helpers(self):
        return self.users.count()


    def __str__(self):
        return self.name

    def deactivate(self):
        posts  = self.posts.filter(state__id__in=[1, 2, 7])
        unique_emails = list(posts.values_list('user__email', flat=True).distinct())
        send_email_to_user(
            email=unique_emails,
            subject='Pausa temporal de la filial ' + self.name,
            message= 'La sucursal ' + self.name + 
                ' ha sido pausada temporalmente, todas sus publicaciones relacionadas con esta filial quedarán suspendidas hasta ' + 
                ' que se incorpore un nuevo ayudante a la sucursal. \n'
                + 'Para que su publicación sea visible nuevamente, seleccione una nueva filial activa en la que desee publicar. \n'
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
                message='La publicación ' + post.name + ' ha sido suspendida debido a que la filial ' + self.name + ' ha sido pausada temporalmente. \n' +
                    'Todos las solicitudes y turnos pendientes relacionados a esta publicación seran cancelados. \n' +
                    'Disculpe las molestias ocasionadas. \n' +
                    'Saludos, el equipo de SwapIT. \n'
            )

        for post in posts:
            post.posts_send.filter(state__id__in=[2,4]).update(state=3)
            post.posts_receive.filter(state__id__in=[2,4]).update(state=3)

            turns_made = post.turns_send.filter(state__id=1)
            turns_receive = post.turns_receive.filter(state__id=1)

            for turn in turns_made:
                if turn.post_maker.stock_product == 0 and turn.post_maker.state.id == 7:
                    turn.post_maker.update(state=1)

                if turn.post_receive.stock_product == 0 and turn.post_receive.state.id == 7:
                    turn.post_receive.update(state=1)

                turn.post_maker.stock_product += 1
                turn.post_receive.stock_product += 1
                turn.post_maker.save()
                turn.post_receive.save()

        
            for turn in turns_receive:
                if turn.post_maker.stock_product == 0 and turn.post_maker.state.id == 7:
                    turn.post_maker.update(state=1)

                if turn.post_receive.stock_product == 0 and turn.post_receive.state.id == 7:
                    turn.post_receive.update(state=1)

                turn.post_maker.stock_product += 1
                turn.post_receive.stock_product += 1
                turn.post_maker.save()
                turn.post_receive.save()

            turns_made.delete()
            turns_receive.delete()

        posts.update(state=3)
        self.active = False 
        self.save()
