# ⚡ ConverseOS — The Enterprise AI Operating System

> **ConverseOS** is a production-ready, enterprise-grade AI workspace enabling organizations to create, deploy, manage, and orchestrate intelligent AI assistants, knowledge bases, workflows, and real-time business integrations.

---

## 🌟 Master Vision & Roadmap

ConverseOS is designed around a multi-phase master roadmap evolving from a multi-tenant AI foundation into a full-scale **Enterprise AI Operating System**.

### Core Architecture Highlights

- **Config-Driven Dashboard**: The admin dashboard is fully dynamically rendered from MongoDB (`dashboardconfigs` collection). No layout or widget structure is hardcoded.
- **Layered Enterprise Architecture**: Strict layer boundaries — Authorization Rules (`access/`) ➔ Services (`services/`) ➔ Route Handlers (`api/`) ➔ Custom Hooks (`hooks/`) ➔ UI Components (`components/`).
- **Multi-Model AI Orchestration**: Google Gemini 1.5 Flash integration with OpenRouter fallbacks and smart mock providers.
- **Isolated Multi-Tenant Security**: Tenant boundaries scoped by URL slugs with role-based access control (Admin / Member).

---

## 🏗 Architecture Blueprint

```
┌─────────────────────────────────────────────────────────────┐
│  UI Layer (React + TanStack Query — no direct DB calls)     │
├─────────────────────────────────────────────────────────────┤
│  Hooks Layer (TanStack Query mutations & query handlers)    │
├─────────────────────────────────────────────────────────────┤
│  Route Layer (Next.js Route Handlers — Zod validated)       │
├─────────────────────────────────────────────────────────────┤
│  Service Layer (Business logic + DB access + AI engine)     │
├─────────────────────────────────────────────────────────────┤
│  Access Layer (Pure authz functions — no side effects)      │
├─────────────────────────────────────────────────────────────┤
│  Data Layer (Mongoose schemas & MongoDB collections)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/shaheeq27/debates-ai-Full-Stack-Assignment.git
cd debates-ai-Full-Stack-Assignment
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set the required environment variables:

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string |
| `AUTH_SECRET` | ✅ Yes | Random 32+ character secret |
| `GEMINI_API_KEY` | Optional | Free key from Google AI Studio |
| `OPENROUTER_API_KEY` | Optional | OpenRouter fallback key |
| `NEXT_PUBLIC_APP_URL` | Optional | Application URL (Default: `http://localhost:3000`) |

### 3. Seed Database

Populate MongoDB with demo organizations, users, product instances, conversations, and dynamic dashboard configurations:

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the ConverseOS Landing Page.

---

## 🔑 Demo Access Accounts

| User | Email | Role | Access Scope |
|---|---|---|---|
| Alice Kumar | `alice@converseos.ai` | Admin | Full admin & workspace access |
| Bob Chen | `bob@converseos.ai` | Admin / Member | Mixed access across workspaces |
| Carol Singh | `carol@acme.com` | Member | Member access at Acme Corp |

---

## 📊 Config-Driven Admin Dashboard

The ConverseOS admin dashboard is dynamically rendered from MongoDB configuration documents.

### Live Verification:

1. Log in as **Alice Kumar** (`alice@converseos.ai`).
2. Navigate to `/acme-corp/admin`.
3. Modify the corresponding document in the `dashboardconfigs` MongoDB collection (e.g. edit a widget label or section name).
4. Refresh the page to see the UI update instantly without code changes or redeployments.

---

## 📄 License

MIT License. Designed and engineered for production SaaS scalability.
