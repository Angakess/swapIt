# Generated by Django 5.0.4 on 2024-05-11 18:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app_post', '0006_rename_id_category_post_category_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='active',
        ),
    ]
