# mini-order-tracker — backend

API REST em Java + Spring Boot para gerenciamento de pedidos, com autenticação simples.
Desafio de processo seletivo: cadastro/login, CRUD de pedidos com status, persistência em SQLite.

## Stack

- Java 21, Spring Boot 4.1.0 (Hibernate ORM 7.4.1.Final)
- Spring Data JPA, Spring Security, Bean Validation
- SQLite (`app.db`) em desenvolvimento/produção — via `sqlite-jdbc` + `hibernate-community-dialects`
- H2 em memória para os testes (`src/test/resources/application.yaml` sobrepõe o principal)
- Lombok
- Maven (use `./mvnw`, não `mvn` global)

## Arquitetura de pastas

Organização em camadas (layer-based), não por feature. Todo código novo deve seguir este padrão:

```
src/main/java/com/cauegallizzi/backend/
├── BackendApplication.java
├── config/        # Configuração do Spring (SecurityConfig, JwtConfig, etc.)
├── controller/     # @RestController — só recebe request, valida entrada e delega ao service
├── service/        # Regras de negócio (@Service) — não deve haver lógica de negócio no controller
├── repository/      # Interfaces JpaRepository
├── entity/         # Entidades JPA (@Entity, @Embeddable, enums de domínio)
├── dto/            # Records/classes de request e response (não expor entidades diretamente na API)
└── exception/       # Exceções customizadas + @ControllerAdvice
```

Regra: ao criar uma nova classe, primeiro identifique a camada (controller/service/repository/entity/dto/config/exception) e coloque-a na pasta correspondente — não crie subpastas por feature (ex.: não criar `order/OrderController.java`).

## Domínio

- **User**: id, name, email (único), password (hash).
- **Order**: id, customerName, deliveryAddress (`@Embeddable`), status (`OrderStatus` enum), items (`List<OrderItem>`, cascade all).
- **OrderStatus**: `RECEBIDO`, `EM_PREPARO`, `SAIU_PARA_ENTREGA`, `ENTREGUE`, `CANCELADO`.
- **OrderItem**: id, productName, quantity, referência ao Order (`@ManyToOne`, `@JsonIgnore` pra evitar loop de serialização).

## Convenções

- IDs sempre em `UUID` (`java.util.UUID`), com `@GeneratedValue(strategy = GenerationType.UUID)` — nunca `Long`/`IDENTITY`. Padrão para todas as entidades novas.
- Enums persistidos com `@Enumerated(EnumType.STRING)`.
- Nunca retornar entidades JPA diretamente nos controllers — sempre passar por um DTO de response.
- Senhas sempre com `BCryptPasswordEncoder`, nunca em texto plano.
- Autenticação via JWT stateless (token no header `Authorization: Bearer <token>`).

## Comandos

```bash
./mvnw clean install     # build + baixa dependências novas do pom.xml
./mvnw spring-boot:run    # roda a aplicação (usa SQLite, src/main/resources/application.yaml)
./mvnw test                # roda os testes (usa H2 em memória, src/test/resources/application.yaml)
```

## Notas

- IntelliJ pode acusar falso-positivo de schema no `application.yaml` (confunde com manifesto Argo CD "Application"). Ignorar ou trocar o schema associado pelo widget do editor — não afeta a build.
