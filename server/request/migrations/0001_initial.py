# Generated by Django 5.0.4 on 2024-05-29 14:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('app_post', '0009_post_stock_product'),
    ]

    operations = [
        migrations.CreateModel(
            name='RequestState',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post_maker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requests_send', to='app_post.post')),
                ('post_receive', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requests_receive', to='app_post.post')),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requests', to='request.requeststate')),
            ],
        ),
    ]
