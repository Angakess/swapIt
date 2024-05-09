# Generated by Django 5.0.4 on 2024-05-09 01:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subsidiary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('x_coordinate', models.CharField(max_length=255)),
                ('y_coordinate', models.CharField(max_length=255)),
                ('active', models.BooleanField(default=True)),
            ],
        ),
    ]
