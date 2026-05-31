# LifeHub Office

Sistema web completo para organização pessoal, produtividade, finanças, saúde e gerenciamento de rotina.

## Sobre o Projeto

O LifeHub é uma plataforma desenvolvida para centralizar diferentes áreas da vida do usuário em um único ambiente digital.

A aplicação reúne ferramentas de:

* Finanças pessoais
* Investimentos
* Saúde
* Exercícios
* Hábitos
* Tarefas
* Projetos
* Eventos
* Notas

O objetivo é fornecer uma visão integrada da rotina, produtividade e evolução pessoal do usuário.

---

## Funcionalidades

### Autenticação

* Cadastro de usuários
* Login com email e senha
* Autenticação JWT
* Refresh Token
* Controle de acesso por usuário

### Dashboard

* Visão geral dos módulos
* Indicadores rápidos
* Estatísticas do usuário
* Resumo financeiro
* Resumo de produtividade

### Finanças

* Cadastro de contas
* Cadastro de categorias
* Registro de receitas
* Registro de despesas
* Histórico financeiro
* Controle de saldo

### Investimentos

* Cadastro de investimentos
* Controle de aportes
* Acompanhamento patrimonial

### Saúde

* Registro de peso
* Registro de altura
* Controle de IMC
* Histórico de evolução

### Exercícios

* Registro de atividades físicas
* Controle de treinos
* Histórico de exercícios

### Hábitos

* Cadastro de hábitos
* Registro diário
* Controle de conclusão
* Acompanhamento de desempenho

### Tarefas

* Criação de tarefas
* Controle de status
* Organização de atividades

### Projetos

* Criação de projetos
* Associação de tarefas
* Controle de progresso

### Eventos

* Agenda de compromissos
* Organização de eventos futuros

### Notas

* Criação de anotações
* Organização de informações pessoais

---

## Tecnologias Utilizadas

### Frontend

* React
* Vite
* JavaScript
* React Router DOM
* Axios
* CSS

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT
* WhiteNoise

### Banco de Dados

Desenvolvimento:

* SQLite

Produção:

* PostgreSQL

### Hospedagem

* Render

### Controle de Versão

* Git
* GitHub

---

## Arquitetura

```text
LifeHubOffice
│
├── FrontEnd
│   ├── src
│   │   ├── api
│   │   ├── pages
│   │   ├── services
│   │   ├── components
│   │   └── assets
│   │
│   └── public
│
├── backend
│   ├── app
│   │   ├── models
│   │   ├── serializers
│   │   ├── views
│   │   ├── urls
│   │   └── backends
│   │
│   └── config
│
└── README.md
```

---

## Requisitos

### Backend

* Python 3.11+
* pip

### Frontend

* Node.js 20+
* npm

### Banco

* SQLite (desenvolvimento)
* PostgreSQL (produção)

---

## Instalação

### Clonar Repositório

```bash
git clone https://github.com/LuizGustavooFerreira/LifeHubOfice.git
```

```bash
cd LifeHubOfice
```

---

## Backend

Entrar na pasta:

```bash
cd backend
```

Criar ambiente virtual:

```bash
python -m venv .venv
```

Ativar ambiente:

Windows

```bash
.venv\Scripts\activate
```

Linux

```bash
source .venv/bin/activate
```

Instalar dependências:

```bash
pip install -r requirements.txt
```

Executar migrações:

```bash
python manage.py migrate
```

Iniciar servidor:

```bash
python manage.py runserver
```

Servidor:

```text
http://127.0.0.1:8000
```

---

## Frontend

Entrar na pasta:

```bash
cd FrontEnd
```

Instalar dependências:

```bash
npm install
```

Criar arquivo:

```text
.env
```

Conteúdo:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Executar:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Variáveis de Ambiente

### Desenvolvimento

Frontend:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Backend:

```env
DEBUG=True
```

### Produção

Frontend:

```env
VITE_API_URL=https://lifehubofice.onrender.com/api
```

Backend:

```env
DEBUG=False
DATABASE_URL=postgresql://...
SECRET_KEY=...
```

---

## API

### Autenticação

```http
POST /api/token/
```

```http
POST /api/token/refresh/
```

### Usuários

```http
GET    /api/usuarios/
POST   /api/usuarios/
PUT    /api/usuarios/{id}
DELETE /api/usuarios/{id}
```

### Finanças

```http
GET /api/transacoes/
POST /api/transacoes/
```

### Hábitos

```http
GET /api/habitos/
POST /api/habitos/
```

### Tarefas

```http
GET /api/tarefas/
POST /api/tarefas/
```

### Projetos

```http
GET /api/projetos/
POST /api/projetos/
```

### Eventos

```http
GET /api/eventos/
POST /api/eventos/
```

---

## Segurança

* JWT Authentication
* Rotas protegidas
* Controle por usuário
* Senhas criptografadas
* Separação entre ambiente local e produção

---

## Roadmap

### Em Desenvolvimento

* Dark Mode
* Dashboard avançado
* Gráficos financeiros
* Relatórios
* Exportação PDF
* Backup de dados
* Notificações
* Integração com Google Calendar

### Futuro

* Aplicativo mobile
* IA para produtividade
* Sincronização em nuvem
* Metas financeiras inteligentes
* Planejamento de estudos
* Integração bancária

---

## Autor

Luiz Gustavo Ferreira

GitHub:
https://github.com/LuizGustavooFerreira

---

## Licença

Projeto desenvolvido para fins acadêmicos, portfólio e aprendizado.
