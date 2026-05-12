from rest_framework import serializers
from .models import *


# ================= USUARIO (LOGIN + CADASTRO) =================
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'avatar_url', 'bio', 'tema', 'idioma', 'criado_em']
        read_only_fields = ['id', 'criado_em']

    def create(self, validated_data):
        password = validated_data.pop('password', None)

        user = Usuario(**validated_data)
        if password:
            user.set_password(password)
        user.save()

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class UsuarioCriacaoSerializer(serializers.ModelSerializer):
    """Serializer para signup/cadastro"""
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = ['email', 'nome', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user


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


# ================= SAÚDE =================
class SaudeRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaudeRegistro
        fields = '__all__'
        read_only_fields = ['imc', 'criado_em']

    def create(self, validated_data):
        peso = validated_data.get('peso')
        altura = validated_data.get('altura')
        
        # Calcula IMC automaticamente
        if peso and altura:
            imc = peso / (altura * altura)
            validated_data['imc'] = imc
        
        return super().create(validated_data)


# ================= EXERCÍCIOS =================
class ExercicioRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExercicioRegistro
        fields = '__all__'
        read_only_fields = ['criado_em']


# ================= INVESTIMENTOS =================
class InvestimentoSerializer(serializers.ModelSerializer):
    rendimento_estimado = serializers.SerializerMethodField()
    
    class Meta:
        model = Investimento
        fields = ['id', 'nome', 'tipo', 'valor_investido', 'taxa_juros', 
                  'data_investimento', 'data_resgate', 'ativo', 'notas', 
                  'rendimento_estimado', 'criado_em']
        read_only_fields = ['criado_em', 'rendimento_estimado']
    
    def get_rendimento_estimado(self, obj):
        """Calcula rendimento estimado"""
        from datetime import date
        from decimal import Decimal
        
        if not obj.ativo or obj.data_resgate:
            return 0
        
        dias = (date.today() - obj.data_investimento).days
        anos = Decimal(dias) / Decimal(365)
        
        # Juros compostos: M = P(1 + i)^t
        taxa_decimal = obj.taxa_juros / Decimal(100)
        rendimento = obj.valor_investido * ((1 + taxa_decimal) ** anos) - obj.valor_investido
        
        return float(rendimento)