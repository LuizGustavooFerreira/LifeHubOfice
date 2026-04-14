from django.db import models

import uuid
from django.db import models

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager


# ================= BASE =================
class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email obrigatório')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # 🔥 senha segura
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    nome = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    avatar_url = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    tema = models.CharField(max_length=10, default='system')
    idioma = models.CharField(max_length=10, default='pt-BR')
    fuso_horario = models.CharField(max_length=60, default='America/Sao_Paulo')
    notificacoes_ativas = models.BooleanField(default=True)
    dois_fatores_ativo = models.BooleanField(default=False)
    dois_fatores_secret = models.TextField(blank=True, null=True)
    email_verificado = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


# ================= CATEGORIA =================
class Categoria(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    nome = models.CharField(max_length=80)
    cor = models.CharField(max_length=7, default='#6366f1')
    icone = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        unique_together = ('usuario', 'nome')


# ================= AUDITORIA =================
class AuditoriaLog(models.Model):
    ACAO = [('INSERT','INSERT'),('UPDATE','UPDATE'),('DELETE','DELETE')]

    id = models.BigAutoField(primary_key=True)
    usuario_id = models.UUIDField(null=True, blank=True)
    tabela = models.CharField(max_length=100)
    registro_id = models.UUIDField(null=True, blank=True)
    acao = models.CharField(max_length=10, choices=ACAO)
    dados_antes = models.JSONField(null=True, blank=True)
    dados_apos = models.JSONField(null=True, blank=True)
    ip = models.CharField(max_length=45, null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)


# ================= CONTAS =================
class Conta(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20)
    saldo = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    moeda = models.CharField(max_length=3, default='BRL')
    ativa = models.BooleanField(default=True)

    atualizado_em = models.DateTimeField(auto_now=True)


# ================= TRANSAÇÕES =================
class Transacao(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    conta = models.ForeignKey(Conta, on_delete=models.PROTECT)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)

    tipo = models.CharField(max_length=20)
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=15, decimal_places=2)
    data = models.DateField()

    recorrente = models.BooleanField(default=False)
    frequencia = models.CharField(max_length=20, null=True, blank=True)
    observacao = models.TextField(null=True, blank=True)
    tags = models.JSONField(null=True, blank=True)

    atualizado_em = models.DateTimeField(auto_now=True)
    deletado_em = models.DateTimeField(null=True, blank=True)


# ================= HÁBITOS =================
class Habito(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)

    nome = models.CharField(max_length=150)
    descricao = models.TextField(null=True, blank=True)

    frequencia = models.CharField(max_length=20, default='diaria')
    dias_semana = models.JSONField(null=True, blank=True)

    hora_lembrete = models.TimeField(null=True, blank=True)

    meta_sequencia = models.IntegerField(default=0)
    sequencia_atual = models.IntegerField(default=0)
    melhor_sequencia = models.IntegerField(default=0)

    total_registros = models.IntegerField(default=0)
    taxa_conclusao = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    cor = models.CharField(max_length=7, default='#10b981')
    icone = models.CharField(max_length=50, null=True, blank=True)

    ativo = models.BooleanField(default=True)

    atualizado_em = models.DateTimeField(auto_now=True)
    deletado_em = models.DateTimeField(null=True, blank=True)


class HabitoRegistro(BaseModel):
    habito = models.ForeignKey(Habito, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    data_registro = models.DateField()
    concluido = models.BooleanField(default=False)

    nota = models.TextField(null=True, blank=True)
    valor_numerico = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        unique_together = ('habito', 'data_registro')


# ================= TAREFAS =================
class Tarefa(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)

    titulo = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)

    status = models.CharField(max_length=20, default='pendente')
    prioridade = models.CharField(max_length=20, default='media')

    data_vencimento = models.DateField(null=True, blank=True)
    hora_vencimento = models.TimeField(null=True, blank=True)

    concluida_em = models.DateTimeField(null=True, blank=True)

    recorrente = models.BooleanField(default=False)
    frequencia = models.CharField(max_length=20, null=True, blank=True)

    tags = models.JSONField(null=True, blank=True)
    ordem = models.IntegerField(default=0)

    atualizado_em = models.DateTimeField(auto_now=True)
    deletado_em = models.DateTimeField(null=True, blank=True)


# ================= PROJETOS =================
class Projeto(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)

    titulo = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)

    status = models.CharField(max_length=20, default='pendente')
    progresso = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    data_inicio = models.DateField(null=True, blank=True)
    data_fim = models.DateField(null=True, blank=True)

    tags = models.JSONField(null=True, blank=True)

    atualizado_em = models.DateTimeField(auto_now=True)
    deletado_em = models.DateTimeField(null=True, blank=True)


class ProjetoTarefa(models.Model):
    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE)
    tarefa = models.ForeignKey(Tarefa, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('projeto', 'tarefa')


# ================= NOTAS =================
class Nota(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)

    titulo = models.CharField(max_length=255, null=True, blank=True)
    conteudo = models.TextField()

    fixada = models.BooleanField(default=False)
    tags = models.JSONField(null=True, blank=True)

    atualizado_em = models.DateTimeField(auto_now=True)
    deletado_em = models.DateTimeField(null=True, blank=True)


# ================= EVENTOS =================
class Evento(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)

    titulo = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)

    tipo = models.CharField(max_length=20, default='pessoal')

    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField(null=True, blank=True)

    dia_inteiro = models.BooleanField(default=False)

    local = models.CharField(max_length=255, null=True, blank=True)

    recorrente = models.BooleanField(default=False)
    frequencia = models.CharField(max_length=20, null=True, blank=True)

    cor = models.CharField(max_length=7, default='#6366f1')
    lembrete_min = models.IntegerField(null=True, blank=True)

    atualizado_em = models.DateTimeField(auto_now=True)
    deletado_em = models.DateTimeField(null=True, blank=True)