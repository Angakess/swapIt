# Generated by Django 5.0.4 on 2024-05-06 21:57

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='PostState',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('value', models.FloatField()),
                ('id_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_post.category')),
                ('id_state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_post.poststate')),
            ],
        ),
    ]
