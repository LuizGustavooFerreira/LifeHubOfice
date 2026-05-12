# ⚡ INICIALIZAÇÃO RÁPIDA (2 MINUTOS)

## 🚀 Copie e cole estes comandos

### Terminal 1 - Backend
```bash
cd c:\Users\luizg\LifeHubOfice\backend
python -m venv venv
venv\Scripts\activate
pip install Django==4.2 djangorestframework==3.14 django-cors-headers==4.0 djangorestframework-simplejwt==5.2 psycopg2-binary==2.9
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
cd c:\Users\luizg\LifeHubOfice\FrontEnd
npm install
npm run dev
```

### Browser
```
http://localhost:5173/usuario/cadastro
→ Criar conta
→ Login
→ Usar aplicação
```

---

## ✅ O que funciona agora

✓ Login com email + senha
✓ Cadastro de usuários
✓ JWT tokens
✓ 6 módulos completos:
  - Tarefas
  - Hábitos  
  - Finanças
  - Saúde
  - Exercícios
  - Investimentos

✓ Sincronização com PostgreSQL
✓ Multi-device
✓ Segurança JWT + Row-level

---

## 📚 Documentação

- **SETUP.md** - Setup detalhado
- **RESUMO_RAPIDO.md** - Rápido
- **ANALISE_COMPLETA_E_CORRECOES.md** - Completo com código
- **GUIA_TESTES_HTTP.md** - Exemplos HTTP
- **CHECKLIST_CORRECOES.md** - Antes/Depois
- **README_FINAL.md** - Visão geral

---

Pronto! 🎉
