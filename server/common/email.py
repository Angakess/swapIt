from django.core.mail import send_mail
from swap_it.settings import EMAIL_HOST_USER, DEFAULT_FROM_EMAIL

def send_email_to_user(email,subject, message ):
    if(len(email) == 0): return None
    send_mail(
        subject, 
        message, 
        EMAIL_HOST_USER, 
        email
    )