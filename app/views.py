from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt import exceptions as jwt_exceptions
from django.contrib.auth import authenticate
from .models import *
from .serializers import *


# ===== JWT COM EMAIL =====
class MeuTokenSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise jwt_exceptions.AuthenticationFailed('Credenciais inválidas')

        refresh = self.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class MeuTokenView(TokenObtainPairView):
    serializer_class = MeuTokenSerializer


# ===== VIEWS =====
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]


class AuditoriaLogViewSet(viewsets.ModelViewSet):
    queryset = AuditoriaLog.objects.all()
    serializer_class = AuditoriaLogSerializer
    permission_classes = [IsAuthenticated]


class ContaViewSet(viewsets.ModelViewSet):
    queryset = Conta.objects.all()
    serializer_class = ContaSerializer
    permission_classes = [IsAuthenticated]


class TransacaoViewSet(viewsets.ModelViewSet):
    queryset = Transacao.objects.all()
    serializer_class = TransacaoSerializer
    permission_classes = [IsAuthenticated]


class HabitoViewSet(viewsets.ModelViewSet):
    queryset = Habito.objects.all()
    serializer_class = HabitoSerializer
    permission_classes = [IsAuthenticated]


class HabitoRegistroViewSet(viewsets.ModelViewSet):
    queryset = HabitoRegistro.objects.all()
    serializer_class = HabitoRegistroSerializer
    permission_classes = [IsAuthenticated]


class TarefaViewSet(viewsets.ModelViewSet):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer
    permission_classes = [IsAuthenticated]


class ProjetoViewSet(viewsets.ModelViewSet):
    queryset = Projeto.objects.all()
    serializer_class = ProjetoSerializer
    permission_classes = [IsAuthenticated]


class ProjetoTarefaViewSet(viewsets.ModelViewSet):
    queryset = ProjetoTarefa.objects.all()
    serializer_class = ProjetoTarefaSerializer
    permission_classes = [IsAuthenticated]


class NotaViewSet(viewsets.ModelViewSet):
    queryset = Nota.objects.all()
    serializer_class = NotaSerializer
    permission_classes = [IsAuthenticated]


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [IsAuthenticated]