# API — mini-order-tracker (backend)

Base URL local: `http://localhost:8080`

Autenticação: JWT stateless. Após registro/login, envie o token em todas as rotas protegidas:

```
Authorization: Bearer <token>
```

Collection do Postman: workspace **Caue - Projects** → `Mini Order Tracker - Backend`.

---

## Auth

### `POST /api/auth/register`

Cria um novo usuário e já retorna um token autenticado.

**Rota pública** (não exige token).

**Body**
```json
{
  "name": "Caue Gallizzi",
  "email": "caue@example.com",
  "password": "senha12345"
}
```

Validações: `name` obrigatório; `email` obrigatório e formato válido; `password` obrigatório, mínimo 8 caracteres.

**Respostas**
- `201 Created`
  ```json
  { "token": "<jwt>" }
  ```
- `400 Bad Request` — falha de validação:
  ```json
  { "timestamp": "...", "status": 400, "errors": { "email": "must be a well-formed email address" } }
  ```
- `409 Conflict` — e-mail já cadastrado:
  ```json
  { "timestamp": "...", "status": 409, "message": "E-mail já está em uso: caue@example.com" }
  ```

---

### `POST /api/auth/login`

Autentica um usuário existente e retorna um novo token.

**Rota pública** (não exige token).

**Body**
```json
{
  "email": "caue@example.com",
  "password": "senha12345"
}
```

**Respostas**
- `200 OK`
  ```json
  { "token": "<jwt>" }
  ```
- `401 Unauthorized` — credenciais inválidas:
  ```json
  { "timestamp": "...", "status": 401, "message": "Credenciais inválidas" }
  ```

---

## Users

### `GET /api/users/me`

Retorna os dados do usuário autenticado (identificado pelo token, sem precisar de ID na URL).

**Rota protegida** — exige `Authorization: Bearer <token>`.

**Respostas**
- `200 OK`
  ```json
  {
    "id": "b3f1...uuid",
    "name": "Caue Gallizzi",
    "email": "caue@example.com"
  }
  ```
- `401 Unauthorized` — token ausente, inválido ou expirado.

---

## Orders

Todas as rotas abaixo são **protegidas** (exigem `Authorization: Bearer <token>`) e escopadas por usuário: cada usuário só vê, atualiza e deleta os próprios pedidos. Tentar acessar um pedido de outro usuário (ou um id inexistente) retorna `404 Not Found`.

### `POST /api/orders`

Cria um novo pedido, associado ao usuário autenticado. Status inicial sempre `RECEBIDO`.

**Body**
```json
{
  "customerName": "João da Silva",
  "items": [
    { "productName": "Pizza Margherita", "quantity": 1 },
    { "productName": "Refrigerante 2L", "quantity": 2 }
  ],
  "deliveryAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  }
}
```

Validações: `customerName` obrigatório; `items` não pode ser vazio, cada item com `productName` obrigatório e `quantity >= 1`; `deliveryAddress` obrigatório com todos os campos preenchidos.

**Respostas**
- `201 Created`
  ```json
  {
    "id": "b3f1...uuid",
    "customerName": "João da Silva",
    "deliveryAddress": { "street": "Rua das Flores", "number": "123", "neighborhood": "Centro", "city": "São Paulo", "state": "SP", "zipCode": "01234-567" },
    "status": "RECEBIDO",
    "items": [
      { "id": "...uuid", "productName": "Pizza Margherita", "quantity": 1 },
      { "id": "...uuid", "productName": "Refrigerante 2L", "quantity": 2 }
    ]
  }
  ```
- `400 Bad Request` — falha de validação (mesmo formato do register).
- `401 Unauthorized` — sem token válido.

---

### `GET /api/orders`

Lista todos os pedidos do usuário autenticado.

**Respostas**
- `200 OK` — array de `OrderResponse` (mesmo shape do retorno do create).

---

### `GET /api/orders/{id}`

Busca um pedido específico por id.

**Respostas**
- `200 OK` — `OrderResponse`.
- `404 Not Found` — pedido não existe ou não pertence ao usuário autenticado.

---

### `PUT /api/orders/{id}`

Atualiza os dados completos de um pedido (cliente, itens e endereço de entrega). O `status` não é alterado por esse endpoint — para isso use o `PATCH /api/orders/{id}/status`.

**Body** — mesmo formato do `POST /api/orders`:
```json
{
  "customerName": "João da Silva",
  "items": [
    { "productName": "Pizza Margherita", "quantity": 2 }
  ],
  "deliveryAddress": {
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  }
}
```

Validações: idênticas ao `POST /api/orders`. A lista de itens enviada **substitui inteiramente** a lista anterior (itens antigos não incluídos no body são removidos).

**Respostas**
- `200 OK` — `OrderResponse` com os dados atualizados.
- `400 Bad Request` — falha de validação (mesmo formato do create).
- `404 Not Found` — pedido não existe ou não pertence ao usuário autenticado.

---

### `PATCH /api/orders/{id}/status`

Atualiza o status de um pedido. Aceita qualquer um dos 5 valores, sem restrição de transição/sequência.

**Body**
```json
{ "status": "EM_PREPARO" }
```

Valores possíveis: `RECEBIDO`, `EM_PREPARO`, `SAIU_PARA_ENTREGA`, `ENTREGUE`, `CANCELADO`.

**Respostas**
- `200 OK` — `OrderResponse` com o status atualizado.
- `400 Bad Request` — `status` ausente:
  ```json
  { "timestamp": "...", "status": 400, "errors": { "status": "must not be null" } }
  ```
- `400 Bad Request` — `status` com valor que não existe no enum:
  ```json
  { "timestamp": "...", "status": 400, "message": "Valor inválido para 'status': XYZ. Valores aceitos: [RECEBIDO, EM_PREPARO, SAIU_PARA_ENTREGA, ENTREGUE, CANCELADO]" }
  ```
- `404 Not Found` — pedido não existe ou não pertence ao usuário autenticado.

---

### `DELETE /api/orders/{id}`

Remove um pedido (e seus itens, via cascade).

**Respostas**
- `204 No Content`
- `404 Not Found` — pedido não existe ou não pertence ao usuário autenticado.

---

## Notas gerais

- Todos os IDs (`User`, `Order`, `OrderItem`) são `UUID`.
- Sem sessão no servidor: cada requisição precisa do token, não há cookie/estado guardado no banco.
- Pedidos são isolados por usuário: não existe um "painel compartilhado" — cada conta só enxerga seus próprios pedidos.
- Formato de erro: respostas de erro sempre trazem `timestamp` e `status`, mais um dos dois campos abaixo:
  - `errors` (mapa campo → mensagem) — quando falha a validação do Bean Validation (`@NotBlank`, `@Email`, `@Min`, etc.).
  - `message` (string única) — para erros de negócio (`409` e-mail em uso, `401` credenciais inválidas, `404` recurso não encontrado) e para corpo de requisição malformado/com tipo inválido (ex: `status` fora do enum).
