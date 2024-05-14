from django.db import models
from django.core.validators import MinValueValidator
from common.email import send_email_to_user


class Subsidiary(models.Model):
    name = models.CharField(max_length=255, null=False)
    x_coordinate = models.CharField(max_length=255, null=False)
    y_coordinate = models.CharField(max_length=255, null=False)
    max_helpers = models.IntegerField(
        validators=[MinValueValidator(0)], default=3, null=False)
    active = models.BooleanField(default=True)

    @property
    def cant_current_helpers(self):
        return self.users.count()


    def __str__(self):
        return self.name

    def deactivate(self):
        posts  = self.posts.all()
        unique_emails = list(posts.values_list('user__email', flat=True).distinct())
        send_email_to_user(
            email=unique_emails,
            subject='Pausa temporal de la filial ' + self.name,
            message= 'La sucursal ' + self.name + 
                ' ha sido pausada temporalmente, todas sus publicaciones relacionadas a esta filial, quedaran suspendidas temporalmente.' + 
                'hasta que se incorpore un nuevo ayudante a la sucursal. \n'
                + 'Para que su publicacion sea visible nuevamente, seleccione una nueva filial activa en la que desee publicar. \n'
        )
        posts.update(state=3)
        self.active = False 
        self.save()
