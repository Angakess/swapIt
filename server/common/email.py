from django.core.mail import send_mail
from swap_it.settings import EMAIL_HOST_USER, DEFAULT_FROM_EMAIL

def send_email_to_user(email,subject, message ):
    send_mail(
        subject, 
        message, 
        EMAIL_HOST_USER, 
        [email]
    )