from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(r'usuarios', UsuarioViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'auditoria', AuditoriaLogViewSet)
router.register(r'contas', ContaViewSet)
router.register(r'transacoes', TransacaoViewSet)
router.register(r'habitos', HabitoViewSet)
router.register(r'habitos-registros', HabitoRegistroViewSet)
router.register(r'tarefas', TarefaViewSet)
router.register(r'projetos', ProjetoViewSet)
router.register(r'projetos-tarefas', ProjetoTarefaViewSet)
router.register(r'notas', NotaViewSet)
router.register(r'eventos', EventoViewSet)
router.register(r'saude', SaudeRegistroViewSet)
router.register(r'exercicios', ExercicioRegistroViewSet)
router.register(r'investimentos', InvestimentoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]