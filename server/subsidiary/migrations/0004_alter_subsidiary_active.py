# Generated by Django 5.0.4 on 2024-05-16 00:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subsidiary', '0003_alter_subsidiary_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subsidiary',
            name='active',
            field=models.BooleanField(default=False),
        ),
    ]
