from rest_framework import viewsets
from .models import *
from .serializers import *


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class AuditoriaLogViewSet(viewsets.ModelViewSet):
    queryset = AuditoriaLog.objects.all()
    serializer_class = AuditoriaLogSerializer


class ContaViewSet(viewsets.ModelViewSet):
    queryset = Conta.objects.all()
    serializer_class = ContaSerializer


class TransacaoViewSet(viewsets.ModelViewSet):
    queryset = Transacao.objects.all()
    serializer_class = TransacaoSerializer


class HabitoViewSet(viewsets.ModelViewSet):
    queryset = Habito.objects.all()
    serializer_class = HabitoSerializer


class HabitoRegistroViewSet(viewsets.ModelViewSet):
    queryset = HabitoRegistro.objects.all()
    serializer_class = HabitoRegistroSerializer


class TarefaViewSet(viewsets.ModelViewSet):
    queryset = Tarefa.objects.all()
    serializer_class = TarefaSerializer


class ProjetoViewSet(viewsets.ModelViewSet):
    queryset = Projeto.objects.all()
    serializer_class = ProjetoSerializer


class ProjetoTarefaViewSet(viewsets.ModelViewSet):
    queryset = ProjetoTarefa.objects.all()
    serializer_class = ProjetoTarefaSerializer


class NotaViewSet(viewsets.ModelViewSet):
    queryset = Nota.objects.all()
    serializer_class = NotaSerializer


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer