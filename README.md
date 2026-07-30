# Mini Order Tracker

Aplicação para gerenciamento de pedidos, desenvolvida como desafio de processo seletivo: cadastro/login de usuários, criação de pedidos e acompanhamento de status de entrega.

- **Backend**: Java 21 + Spring Boot, autenticação JWT stateless, persistência em SQLite.
- **Frontend**: Next.js (React) + TypeScript + Tailwind CSS, React Query, React Hook Form + Zod.

## Demo

- **Frontend (produção)**: hospedado na Vercel — https://mini-order-tracker-nine.vercel.app
- **Backend (produção)**: hospedado no Railway — https://mini-order-tracker-production.up.railway.app

## Funcionalidades

- Cadastro de usuário (nome, e-mail, senha) e login via e-mail/senha.
- Autenticação JWT — todas as rotas de pedidos são protegidas e escopadas por usuário (cada conta só vê os próprios pedidos).
- Criar pedido (cliente, itens, endereço de entrega).
- Listar todos os pedidos e buscar por ID.
- Atualizar o status do pedido entre `RECEBIDO`, `EM_PREPARO`, `SAIU_PARA_ENTREGA`, `ENTREGUE` e `CANCELADO`.
- Tema claro/escuro, toasts e validação de formulário por campo.

## Estrutura do repositório

```
mini-order-tracker/
├── backend/     # API REST em Spring Boot
└── frontend/    # Aplicação Next.js
```

---

## Como rodar o backend localmente

**Pré-requisitos**: Java 21 (o projeto usa o Maven Wrapper, não precisa instalar Maven).

```bash
cd backend
JWT_SECRET=$(openssl rand -base64 32) JWT_EXPIRATION_MS=3600000 ./mvnw spring-boot:run
```

- `JWT_SECRET` e `JWT_EXPIRATION_MS` são obrigatórios (sem valor padrão) — a aplicação não sobe sem eles. O secret precisa ter pelo menos 256 bits; o comando acima gera um válido com `openssl`.
- A API sobe em `http://localhost:8080`. O banco SQLite (`app.db`) é criado automaticamente no diretório `backend/`.
- Documentação completa dos endpoints em [`backend/docs/API.md`](backend/docs/API.md).

Rodar os testes (usam H2 em memória, não dependem das variáveis de ambiente acima):

```bash
./mvnw test
```

### Rodando o backend com Docker

Também existe um `Dockerfile` pronto em `backend/`, caso prefira não instalar Java localmente:

```bash
cd backend
docker build -t mini-order-tracker-backend .
docker run -d \
  --name mot-api \
  -p 8080:8080 \
  -e JWT_SECRET=$(openssl rand -base64 32) \
  -e JWT_EXPIRATION_MS=3600000 \
  -e SPRING_DATASOURCE_URL=jdbc:sqlite:/data/app.db \
  -v $(pwd)/data:/data:rw \
  mini-order-tracker-backend
```

O volume `-v $(pwd)/data:/data` garante que o `app.db` sobreviva a restarts/rebuilds do container.

---

## Como rodar o frontend localmente

**Pré-requisitos**: Node.js 18+.

```bash
cd frontend
npm install
```

Crie um arquivo `.env.local` na pasta `frontend/` apontando para a API:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

```bash
npm run dev
```

A aplicação sobe em `http://localhost:3000`. Com o backend também rodando local (porta 8080), o CORS já libera `http://localhost:3000` por padrão — não precisa configurar nada extra pra desenvolvimento.

---

## Deploy

### Frontend

O frontend está hospedado na **Vercel** — basta importar o repositório e apontar a *root directory* para `frontend/`, configurando a env var `NEXT_PUBLIC_API_URL` com a URL do backend em produção.

### Backend

O backend pode ser hospedado em **qualquer servidor** capaz de rodar um container Docker (ou diretamente um `.jar` com Java 21) — não há dependência de nenhum serviço proprietário de nuvem. Em produção ele está no **Railway**, mas o mesmo `Dockerfile` funciona em qualquer VPS com terminal livre para instalar o que for necessário (EC2, DigitalOcean, Fly.io, Render, etc.).

#### Railway (ambiente de produção atual)

O deploy é feito via [config-as-code](https://docs.railway.com/guides/config-as-code) — o arquivo [`backend/railway.toml`](backend/railway.toml) já define o build (Docker) e o start command, então basta:

1. Criar um novo serviço no Railway apontando pro repositório, com **Root Directory** configurado como `backend`.
2. Anexar um **Volume** ao serviço com mount path `/data` (garante que o `app.db` sobreviva a redeploys).
3. Configurar as variáveis de ambiente do serviço:

   ```
   JWT_SECRET=<secret-de-producao>
   JWT_EXPIRATION_MS=3600000
   SPRING_DATASOURCE_URL=jdbc:sqlite:/data/app.db
   CORS_ALLOWED_ORIGINS=https://mini-order-tracker-nine.vercel.app
   ```

O Railway injeta a porta dinamicamente via variável `PORT`; o `startCommand` do `railway.toml` já lida com isso automaticamente.

#### Alternativa: EC2 ou outra VPS

Passos gerais para subir em uma EC2 (ou VPS equivalente) usando o mesmo `Dockerfile`:

1. Instalar o Docker na instância.
2. Clonar o repositório e buildar a imagem (`docker build -t mini-order-tracker-backend backend/`), ou fazer `docker pull` de uma imagem já publicada em um registry (Docker Hub / Amazon ECR).
3. Rodar o container com as variáveis de ambiente de produção:

   ```bash
   docker run -d \
     --name mot-api \
     --restart unless-stopped \
     -p 8080:8080 \
     -e JWT_SECRET=<secret-de-producao> \
     -e JWT_EXPIRATION_MS=3600000 \
     -e SPRING_DATASOURCE_URL=jdbc:sqlite:/data/app.db \
     -e CORS_ALLOWED_ORIGINS=https://mini-order-tracker-nine.vercel.app \
     -v $(pwd)/data:/data:rw \
     mini-order-tracker-backend
   ```

4. Liberar a porta usada (8080, ou 443 se colocar um proxy reverso com HTTPS na frente) no Security Group da instância.

`CORS_ALLOWED_ORIGINS` aceita múltiplas origins separadas por vírgula, e por padrão libera apenas `http://localhost:3000` (uso local) caso não seja definida.

---

## Stack técnica

**Backend**: Java 21, Spring Boot, Spring Data JPA, Spring Security (JWT stateless), Bean Validation, SQLite (`sqlite-jdbc` + `hibernate-community-dialects`), H2 (testes), Lombok, Maven.

**Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, TanStack React Query, React Hook Form + Zod, Axios, Sonner (toasts), Lucide React (ícones).
