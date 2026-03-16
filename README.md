# taco-teste-fullstack
Uma plataforma **full-stack de delivery de comida mexicana com temática retrô 8-bit**, desenvolvida utilizando tecnologias modernas e arquitetura desacoplada.

Este repositório foi **avaliado sob perspectiva de QA (Quality Assurance)**, verificando:

- funcionamento do **backend**
- estabilidade do **frontend**
- comunicação **API ↔ interface**
- integridade de **banco de dados**
- infraestrutura via **Docker**
- automação de **CI/CD**

---

# 🎯 Objetivo do Projeto

O **TacoMex 8-Bit Shop** simula uma loja online de comida mexicana com funcionalidades completas de e-commerce:

- catálogo de produtos
- sistema de autenticação
- gerenciamento de pedidos
- aplicação de promoções
- painel administrativo
- API documentada
- cache com Redis
- ambiente totalmente containerizado

---

# 🧪 Escopo de QA

Durante a análise do projeto foram verificados os seguintes pontos:

### Backend

- Inicialização do servidor **Fastify**
- Estrutura modular das rotas
- Middleware de autenticação **JWT**
- Integração com **PostgreSQL**
- ORM **Drizzle**
- Cache utilizando **Redis**
- Validação de endpoints REST
- Documentação automática com **Swagger**
- Healthcheck da aplicação

### Frontend

- Inicialização com **Vite**
- Estrutura de páginas React
- Gerenciamento de estado com **Zustand**
- Requisições assíncronas com **React Query**
- Integração com API
- Componentes reutilizáveis
- Estrutura organizada de serviços e hooks

### Infraestrutura

- Build e execução via **Docker Compose**
- Comunicação entre containers
- Persistência do banco de dados
- Seed automático na primeira execução
- Health check da API

---

# 🧠 Tecnologias Utilizadas

| Camada | Tecnologia |
|------|------|
Backend | Fastify 4, TypeScript, Drizzle ORM |
Frontend | React 18, Vite 5, Zustand, React Query |
Database | PostgreSQL 15 |
Cache | Redis 7 |
Infra | Docker Compose |

---
