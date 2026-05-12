from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt import exceptions as jwt_exceptions
from django.contrib.auth import authenticate

from .models import *
from .serializers import *


# =========================
# 🔥 JWT LOGIN COM EMAIL
# =========================
class MeuTokenSerializer(TokenObtainPairSerializer):
    """
    Serializer customizado para login com EMAIL + SENHA
    Retorna: access, refresh, usuario_id, nome, email
    """
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise jwt_exceptions.AuthenticationFailed(
                'Email e senha são obrigatórios'
            )

        try:
            user = Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            raise jwt_exceptions.AuthenticationFailed(
                'Usuário não encontrado'
            )

        if not user.check_password(password):
            raise jwt_exceptions.AuthenticationFailed(
                'Senha inválida'
            )

        if not user.is_active:
            raise jwt_exceptions.AuthenticationFailed(
                'Usuário inativo'
            )

        refresh = self.get_token(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'usuario_id': str(user.id),
            'nome': user.nome,
            'email': user.email
        }


class MeuTokenView(TokenObtainPairView):
    serializer_class = MeuTokenSerializer


# =========================
# 🔥 VIEWS (CRUD)
# =========================
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCriacaoSerializer
        return UsuarioSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Categoria.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class AuditoriaLogViewSet(viewsets.ModelViewSet):
    queryset = AuditoriaLog.objects.all()
    serializer_class = AuditoriaLogSerializer
    permission_classes = [IsAuthenticated]


class ContaViewSet(viewsets.ModelViewSet):
    queryset = Conta.objects.all()
    serializer_class = ContaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conta.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class TransacaoViewSet(viewsets.ModelViewSet):
    queryset = Transacao.objects.all()
    serializer_class = TransacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transacao.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class HabitoViewSet(viewsets.ModelViewSet):
    queryset = Habito.objects.all()
    serializer_class = HabitoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Habito.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class HabitoRegistroViewSet(viewsets.ModelViewSet):
    queryset = HabitoRegistro.objects.all()
    serializer_class = HabitoRegistroSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HabitoRegistro.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class TarefaViewSet(viewsets.ModelViewSet):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tarefa.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class ProjetoViewSet(viewsets.ModelViewSet):
    queryset = Projeto.objects.all()
    serializer_class = ProjetoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Projeto.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class ProjetoTarefaViewSet(viewsets.ModelViewSet):
    queryset = ProjetoTarefa.objects.all()
    serializer_class = ProjetoTarefaSerializer
    permission_classes = [IsAuthenticated]


class NotaViewSet(viewsets.ModelViewSet):
    queryset = Nota.objects.all()
    serializer_class = NotaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Nota.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


# ================= SAÚDE =================
class SaudeRegistroViewSet(viewsets.ModelViewSet):
    queryset = SaudeRegistro.objects.all()
    serializer_class = SaudeRegistroSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra por usuário logado
        return SaudeRegistro.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


# ================= EXERCÍCIOS =================
class ExercicioRegistroViewSet(viewsets.ModelViewSet):
    queryset = ExercicioRegistro.objects.all()
    serializer_class = ExercicioRegistroSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra por usuário logado
        return ExercicioRegistro.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


# ================= INVESTIMENTOS =================
class InvestimentoViewSet(viewsets.ModelViewSet):
    queryset = Investimento.objects.all()
    serializer_class = InvestimentoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra por usuário logado
        return Investimento.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
        
        
class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Evento.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)