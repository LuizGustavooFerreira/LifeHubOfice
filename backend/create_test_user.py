import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from app.models import Usuario

email = 'teste@local.test'
password = 'Senha123'
name = 'Teste'

user, created = Usuario.objects.get_or_create(email=email, defaults={'nome': name})
if created:
    user.set_password(password)
    user.save()
    print('CREATED', user.id)
else:
    print('EXISTS', user.id)
