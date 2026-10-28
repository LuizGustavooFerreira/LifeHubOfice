# LifeHub Office

**Uma plataforma web para centralizar organização pessoal, produtividade e gestão financeira em um único ambiente.**

O LifeHub Office é um projeto full-stack desenvolvido para integrar diferentes áreas da rotina, permitindo organizar tarefas, acompanhar hábitos, registrar movimentações financeiras e gerenciar projetos pessoais.

O projeto combina desenvolvimento de APIs, autenticação, persistência de dados e uma interface web para oferecer uma experiência integrada.

## Funcionalidades

- **Dashboard:** visão geral das informações e indicadores dos módulos.
- **Finanças:** gerenciamento de contas, receitas, despesas e categorias.
- **Investimentos:** registro de investimentos e acompanhamento de aportes.
- **Hábitos e saúde:** registro de hábitos, atividades físicas e indicadores pessoais.
- **Tarefas e projetos:** organização de atividades e acompanhamento do progresso.
- **Eventos e notas:** gerenciamento de compromissos e anotações.
- **Autenticação:** cadastro, login, tokens JWT e controle de acesso por usuário.

*As funcionalidades acima devem corresponder ao estado atual da aplicação. Recursos ainda incompletos devem ser identificados como em desenvolvimento.*

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | React, Vite, JavaScript, React Router, Axios e CSS |
| Backend | Python, Django, Django REST Framework |
| Autenticação | Simple JWT |
| Banco de dados | SQLite em desenvolvimento e PostgreSQL em produção |
| Hospedagem | Render |
| Versionamento | Git e GitHub |

## Arquitetura

A aplicação é organizada em duas partes principais:

- **Frontend:** interface, páginas, componentes e comunicação com a API.
- **Backend:** regras de negócio, modelos de dados, serialização, endpoints e autenticação.

O frontend consome os endpoints do backend por meio de requisições HTTP. O Django REST Framework organiza a exposição dos dados, enquanto o banco de dados mantém as informações da aplicação.

## Competências demonstradas

- Desenvolvimento de APIs REST.
- Programação com Python e Django.
- Integração entre frontend e backend.
- Modelagem e persistência de dados relacionais.
- Implementação de autenticação baseada em tokens.
- Organização de uma aplicação web em componentes e módulos.
- Configuração de ambientes de desenvolvimento e produção.

## Executar localmente

### Pré-requisitos

- Python 3.11 ou superior.
- Node.js 20 ou superior.
- npm.

### 1. Clonar o repositório

```bash
git clone https://github.com/LuizGustavooFerreira/LifeHubOfice.git
cd LifeHubOfice
```

### 2. Configurar o backend

```bash
cd backend
python -m venv .venv
```

No Windows:

```bash
.venv\Scripts\activate
```

No Linux/macOS:

```bash
source .venv/bin/activate
```

Instale as dependências e execute as migrações:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Configurar o frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd FrontEnd
npm install
```

Crie um arquivo `.env` com a URL da API local:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Inicie a aplicação:

```bash
npm run dev
```

Consulte a configuração do projeto caso sejam necessárias variáveis adicionais.

## Melhorias planejadas

- Aprimoramento do dashboard e dos gráficos financeiros.
- Exportação de relatórios.
- Notificações e integração com calendário.
- Melhorias de experiência e usabilidade.

## Autor

**Luiz Gustavo Costa Ferreira**

[GitHub](https://github.com/LuizGustavooFerreira)

---

Projeto pessoal desenvolvido para aprendizado e portfólio.
