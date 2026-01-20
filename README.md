# Life Manager - Frontend

Frontend para aplicação de gerenciamento financeiro pessoal (Life Manager). Integração com API Rails usando autenticação por token (Devise Token Auth).

## 🎯 Objetivo

Gerenciar finanças pessoais com uma interface simples, clara e responsiva.

## 🛠 Tech Stack

- **React 19** + TypeScript
- **Vite** - Build tool e dev server
- **React Router v6** - Roteamento
- **Axios** - HTTP client com interceptadores
- **React Hook Form** - Gerenciamento de formulários
- **Tailwind CSS v4** - Styling
- **ESLint + Prettier** - Code quality

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local

# 3. Iniciar desenvolvimento
npm run dev
# Acesse http://localhost:5173
```

## 🔐 Autenticação

Sistema token-based usando Devise Token Auth do Rails:

1. User faz signup em `/signup`
2. Backend retorna `access-token`, `client`, `uid` nos headers
3. Frontend salva no `localStorage`
4. Interceptador do Axios adiciona headers em toda requisição
5. User redirecionado para `/dashboard`

## 📦 Scripts

```bash
npm run dev      # Iniciar dev server (Vite HMR)
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # ESLint
```

## 🔗 Integração com API

**Base URL:** Configurável via `VITE_API_BASE_URL` (`.env.local`)

**Autenticação:** Token-based com headers:
- `access-token`: Token JWT
- `client`: Client ID
- `uid`: User email

**Paginação (transações):** o frontend envia `page` e `per_page` na listagem e espera `meta` na resposta (`current_page`, `per_page`, `total_count`).
