# 🧪 GUIA DE TESTES HTTP

## 1. SIGNUP (Criar Conta)

**POST** `"/api""/api"/usuarios/`

```json
{
  "email": "joao@example.com",
  "nome": "João Silva",
  "password": "senha123456"
}
```

**Resposta 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "email": "joao@example.com",
  "avatar_url": null,
  "bio": null,
  "tema": "system",
  "idioma": "pt-BR",
  "criado_em": "2026-05-12T17:30:00Z"
}
```

---

## 2. LOGIN (Obter Token)

**POST** `"/api""/api"/token/`

```json
{
  "email": "joao@example.com",
  "password": "senha123456"
}
```

**Resposta 200:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "usuario_id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "email": "joao@example.com"
}
```

→ Salvar `access` em localStorage como `access_token`

---

## 3. CRIAR TAREFA

**POST** `"/api""/api"/tarefas/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Comprar leite",
  "descricao": "Leite integral 1L",
  "status": "pendente",
  "data_vencimento": "2026-05-15",
  "prioridade": "media"
}
```

**Resposta 201:**
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "titulo": "Comprar leite",
  "descricao": "Leite integral 1L",
  "status": "pendente",
  "data_vencimento": "2026-05-15",
  "prioridade": "media",
  "concluida_em": null,
  "criado_em": "2026-05-12T17:30:00Z"
}
```

---

## 4. LISTAR TAREFAS

**GET** `"/api""/api"/tarefas/`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Resposta 200:**
```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "titulo": "Comprar leite",
    "status": "pendente",
    "data_vencimento": "2026-05-15",
    ...
  },
  {
    "id": "a47ac10b-58cc-4372-a567-0e02b2c3d480",
    "titulo": "Fazer exercício",
    "status": "concluida",
    ...
  }
]
```

---

## 5. ATUALIZAR TAREFA

**PATCH** `"/api""/api"/tarefas/{id}/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "status": "concluida",
  "concluida_em": "2026-05-12T17:35:00Z"
}
```

**Resposta 200:** (tarefa atualizada)

---

## 6. DELETAR TAREFA

**DELETE** `"/api""/api"/tarefas/{id}/`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Resposta 204:** (sem corpo)

---

## 7. REGISTRAR HÁBITO HOJE

**POST** `"/api""/api"/habitos-registros/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "habito": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "data_registro": "2026-05-12",
  "concluido": true
}
```

**Resposta 201:**
```json
{
  "id": "b47ac10b-58cc-4372-a567-0e02b2c3d481",
  "habito": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "data_registro": "2026-05-12",
  "concluido": true,
  "criado_em": "2026-05-12T17:35:00Z"
}
```

---

## 8. REGISTRAR PESO/ALTURA (Saúde)

**POST** `"/api""/api"/saude/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "data_registro": "2026-05-12",
  "peso": 75.5,
  "altura": 1.80
}
```

**Resposta 201:**
```json
{
  "id": "c47ac10b-58cc-4372-a567-0e02b2c3d482",
  "data_registro": "2026-05-12",
  "peso": 75.5,
  "altura": 1.80,
  "imc": 23.3,
  "criado_em": "2026-05-12T17:35:00Z"
}
```

---

## 9. REGISTRAR EXERCÍCIO

**POST** `"/api""/api"/exercicios/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Corrida",
  "tempo_minutos": 30,
  "intensidade": "intensa",
  "data_registro": "2026-05-12"
}
```

**Resposta 201:**
```json
{
  "id": "d47ac10b-58cc-4372-a567-0e02b2c3d483",
  "nome": "Corrida",
  "tempo_minutos": 30,
  "intensidade": "intensa",
  "data_registro": "2026-05-12",
  "criado_em": "2026-05-12T17:35:00Z"
}
```

---

## 10. REGISTRAR INVESTIMENTO

**POST** `"/api""/api"/investimentos/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "CDB 10% a.a.",
  "tipo": "cdb",
  "valor_investido": 10000.00,
  "taxa_juros": 10.0,
  "data_investimento": "2026-05-12"
}
```

**Resposta 201:**
```json
{
  "id": "e47ac10b-58cc-4372-a567-0e02b2c3d484",
  "nome": "CDB 10% a.a.",
  "tipo": "cdb",
  "valor_investido": 10000.00,
  "taxa_juros": 10.0,
  "data_investimento": "2026-05-12",
  "rendimento_estimado": 250.50,
  "ativo": true,
  "criado_em": "2026-05-12T17:35:00Z"
}
```

---

## 11. REFRESH TOKEN

**POST** `"/api""/api"/token/refresh/`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "refresh": "{refresh_token}"
}
```

**Resposta 200:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc... (novo access token)"
}
```

---

## 🔥 USANDO NO FRONTEND

```javascript
// Fazer requisição com token
const api = axios.create({
  baseURL: '"/api""/api"/'
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usar
const tarefas = await api.get('tarefas/');
await api.post('tarefas/', { titulo: 'Nova tarefa', ... });
```

---

## ⚠️ ERROS COMUNS

### 401 Unauthorized
```
❌ Token não enviado ou inválido
✓ Verificar localStorage.access_token
✓ Re-fazer login se expirado
```

### 403 Forbidden
```
❌ Usuário não tem permissão
✓ Verificar se objeto pertence ao usuário
```

### 400 Bad Request
```
❌ Campos obrigatórios faltando
✓ Ver resposta de erro
```

### 404 Not Found
```
❌ Recurso não existe ou ID incorreto
✓ Verificar ID do recurso
```

---

## 🧪 TESTE COM CURL

```bash
# Login
curl -X POST "/api""/api"/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123456"}'

# Criar tarefa (substitua TOKEN)
curl -X POST "/api""/api"/tarefas/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Teste","status":"pendente","data_vencimento":"2026-05-15"}'

# Listar tarefas
curl -X GET "/api""/api"/tarefas/ \
  -H "Authorization: Bearer TOKEN"
```

---

## 📱 TESTE COM POSTMAN

1. Importe esta collection
2. Configure variáveis: `base_url`, `token`
3. Use em todas as requisições: `{{base_url}}"/api"/tarefas/`
4. Adicione header: `Authorization: Bearer {{token}}`

---

Ver `ANALISE_COMPLETA_E_CORRECOES.md` para mais detalhes!
