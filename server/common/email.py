from django.core.mail import send_mail
from swap_it.settings import EMAIL_HOST_USER

def send_email_to_user(email,subject, message ):
    from_email = EMAIL_HOST_USER
    to_email = [email]
    send_mail(subject, message, from_email, to_email)