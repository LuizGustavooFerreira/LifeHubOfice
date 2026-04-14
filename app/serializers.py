from rest_framework import serializers
from .models import *

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class AuditoriaLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditoriaLog
        fields = '__all__'

class ContaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conta
        fields = '__all__'

class TransacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transacao
        fields = '__all__'

class HabitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habito
        fields = '__all__'

class HabitoRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitoRegistro
        fields = '__all__'

class TarefaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = '__all__'

class ProjetoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projeto
        fields = '__all__'

class ProjetoTarefaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjetoTarefa
        fields = '__all__'

class NotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nota
        fields = '__all__'

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = '__all__'