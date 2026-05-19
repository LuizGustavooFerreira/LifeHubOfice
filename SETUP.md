# 🔧 SCRIPT DE SETUP - LIFEHUB

## ✅ VERIFICAÇÃO PRÉ-SETUP

```bash
# 1. Python
python --version
# Esperado: Python 3.8+

# 2. Node.js
node --version
npm --version
# Esperado: Node 16+, npm 8+

# 3. PostgreSQL
psql --version
# Esperado: PostgreSQL 12+

# 4. Git
git --version
# Esperado: Git 2.0+
```

---

## 🚀 SETUP BACKEND (Django)

### Passo 1: Entrar na pasta
```bash
cd c:\Users\luizg\LifeHubOfice\backend
```

### Passo 2: Criar Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Verificar
python --version
```

### Passo 3: Instalar Dependências
```bash
pip install --upgrade pip

# Criar requirements.txt se não existir
pip install Django==4.2
pip install djangorestframework==3.14
pip install django-cors-headers==4.0
pip install djangorestframework-simplejwt==5.2
pip install psycopg2-binary==2.9

# Salvar para referência
pip freeze > requirements.txt
```

### Passo 4: Verificar settings.py
```python
# settings.py deve ter:

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app',
    'rest_framework',
    'rest_framework_simplejwt',  # ← IMPORTANTE
    'corsheaders',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'LifeHubOfice',
        'USER': 'postgres',
        'PASSWORD': '123456',
        'HOST': '"/api"',
        'PORT': '5432',
    }
}

AUTH_USER_MODEL = 'app.Usuario'

AUTHENTICATION_BACKENDS = [
    'app.backends.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]
```

### Passo 5: Criar Migrations
```bash
python manage.py makemigrations
# Deve gerar migrations para:
# - SaudeRegistro
# - ExercicioRegistro
# - Investimento
```

### Passo 6: Aplicar Migrations
```bash
python manage.py migrate
```

### Passo 7: Criar Superuser
```bash
python manage.py createsuperuser

# Preencher com:
# Email: admin@example.com
# Senha: sua_senha_segura
# (nome é optional)
```

### Passo 8: Rodar Servidor Django
```bash
python manage.py runserver
```

**Esperado:**
```
Starting development server at http://127.0.0.1:8000/
Press CTRL+C to quit.
```

### Testes Backend
```bash
# 1. Admin
Abrir: "/api"/admin
Login: admin@example.com / sua_senha

# 2. API
Abrir: "/api""/api"/
Deve listar endpoints

# 3. Token
POST "/api""/api"/token/
Body: { "email": "admin@example.com", "password": "sua_senha" }
Deve retornar: { "access": "...", "refresh": "...", ... }
```

---

## ⚙️ SETUP FRONTEND (React)

### Passo 1: Entrar na pasta
```bash
cd c:\Users\luizg\LifeHubOfice\FrontEnd
```

### Passo 2: Instalar Dependências
```bash
npm install

# Verificar
npm --version
node --version
```

### Passo 3: Verificar api.js
```javascript
// src"/api""/api".js deve ter interceptors JWT

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000"/api"/"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/usuario/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Passo 4: Rodar Frontend
```bash
npm run dev
```

**Esperado:**
```
VITE v7.3.1  ready in XXX ms

➜  Local:   http://"/api":5173/
➜  press h to show help
```

### Testes Frontend
```
1. Abrir: http://"/api":5173/usuario/cadastro
2. Criar conta: novo@email.com / senha123456 / Seu Nome
3. Ir para login
4. Login: novo@email.com / senha123456
5. Deve redirecionar para /index
6. Clicar em Tarefas
7. Adicionar "Comprar leite"
8. Deve aparecer na lista
9. Marcar como concluída
10. Recarregar página - deve manter dados (vindo do backend)
```

---

## 🧪 TESTE COMPLETO

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
cd FrontEnd
npm run dev
```

### Terminal 3 - Testes Manual
```bash
# 1. Signup
curl -X POST "/api""/api"/usuarios/ \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","nome":"Teste","password":"senha123"}'

# 2. Login
curl -X POST "/api""/api"/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha123"}'

# 3. Criar Tarefa (substitua TOKEN)
TOKEN="seu_access_token_aqui"
curl -X POST "/api""/api"/tarefas/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Teste","status":"pendente","data_vencimento":"2026-05-15"}'

# 4. Listar Tarefas
curl -X GET "/api""/api"/tarefas/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### Backend
- [ ] `python manage.py runserver` funciona
- [ ] "/api"/admin carrega
- [ ] Admin login funciona
- [ ] POST "/api"/token/ retorna tokens
- [ ] GET "/api"/tarefas/ retorna lista (protegido)
- [ ] Novos modelos aparecem no admin:
  - [ ] SaudeRegistro
  - [ ] ExercicioRegistro
  - [ ] Investimento

### Frontend
- [ ] `npm run dev` funciona
- [ ] http://"/api":5173 carrega
- [ ] /usuario/cadastro funciona
- [ ] Cadastro cria usuário no backend
- [ ] Login gera tokens
- [ ] Token salvo em localStorage
- [ ] Pages carregam com dados do backend:
  - [ ] Tarefas
  - [ ] Hábitos
  - [ ] Finanças
  - [ ] Saúde
  - [ ] Exercícios
  - [ ] Investimentos

### Integração
- [ ] Criar tarefa no frontend → aparece no admin
- [ ] Editar tarefa no frontend → atualiza no backend
- [ ] Deletar tarefa no frontend → remove do backend
- [ ] Logout → redireciona para login
- [ ] Token expirado → redireciona para login
- [ ] Outro usuário não vê dados do primeiro

---

## 🆘 TROUBLESHOOTING

### Erro: `ModuleNotFoundError: No module named 'rest_framework_simplejwt'`
```bash
pip install djangorestframework-simplejwt
python manage.py runserver
```

### Erro: `django.db.utils.OperationalError: could not translate host name ""/api"" to address`
```
❌ PostgreSQL não está rodando
✓ Iniciar PostgreSQL Services
✓ Ou mudar DATABASES para SQLite para testes:
  'ENGINE': 'django.db.backends.sqlite3',
  'NAME': BASE_DIR / 'db.sqlite3',
```

### Erro: `CORS error` no frontend
```
Frontend: http://"/api":5173
Backend: "/api"

Verificar settings.py:
CORS_ALLOWED_ORIGINS = [
    "http://"/api":5173",
]
```

### Erro: `401 Unauthorized` no frontend
```
❌ Token não está sendo enviado
✓ Verificar localStorage.access_token existe
✓ Verificar api.js interceptor funciona
✓ Fazer novo login
```

### Erro: `Cannot find module 'api'`
```bash
# Verificar se api.js existe
ls src"/api""/api".js

# Se não existir:
# Copiar de outro lugar ou criar:
# cat > src"/api""/api".js << 'EOF'
# (colar conteúdo)
# EOF
```

---

## 📊 ESTRUTURA FINAL

```
LifeHubOfice/
├── backend/
│   ├── app/
│   │   ├── models.py ✓
│   │   ├── views.py ✓
│   │   ├── serializers.py ✓
│   │   ├── urls.py ✓
│   │   ├── backends.py ✓ NOVO
│   │   ├── admin.py ✓
│   │   └── migrations/
│   │       └── 000X_*.py ✓ Novos
│   ├── config/
│   │   ├── settings.py ✓
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── manage.py
│   └── requirements.txt
│
├── FrontEnd/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js ✓
│   │   ├── pages/
│   │   │   ├── usuario/
│   │   │   │   ├── Login.jsx ✓
│   │   │   │   └── Cadastro.jsx ✓
│   │   │   ├── Tarefas/ ✓
│   │   │   ├── Habitos/ ✓
│   │   │   ├── Financas/ ✓
│   │   │   ├── Saude/ ✓
│   │   │   ├── Exercicios/ ✓
│   │   │   └── Investimentos/ ✓
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── ANALISE_COMPLETA_E_CORRECOES.md ✓
├── RESUMO_RAPIDO.md ✓
├── GUIA_TESTES_HTTP.md ✓
├── CHECKLIST_CORRECOES.md ✓
├── README_FINAL.md ✓
└── SETUP.md ← ESTE ARQUIVO
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✓ Backend setup completo
2. ✓ Frontend setup completo
3. ✓ Testes manuais passaram
4. [ ] Deploy em produção (AWS/Heroku/Digital Ocean)
5. [ ] Configurar CI/CD (GitHub Actions)
6. [ ] Monitoramento e logs

---

## 📞 LINKS ÚTEIS

- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- React Docs: https://react.dev/
- SimpleJWT: https://django-rest-framework-simplejwt.readthedocs.io/
- PostgreSQL: https://www.postgresql.org/docs/

---

**Setup concluído! 🎉**

Qualquer problema, consulte os 5 arquivos de documentação gerados!

Ver também:
- RESUMO_RAPIDO.md
- ANALISE_COMPLETA_E_CORRECOES.md
- GUIA_TESTES_HTTP.md
- CHECKLIST_CORRECOES.md
- README_FINAL.md
