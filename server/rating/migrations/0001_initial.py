# Generated by Django 5.0.4 on 2024-05-30 00:29

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.FloatField()),
                ('comment', models.CharField(max_length=255)),
                ('user_maker', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='ratings_made', to=settings.AUTH_USER_MODEL)),
                ('user_received', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='ratings_received', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
