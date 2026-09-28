# ADR-001: Technology Stack Selection

## Status
Accepted

## Context
ConverseOS requires a high-performance, full-stack, enterprise-grade framework supporting server-rendered views, streaming AI responses, strict authorization rules, dynamic JSON-driven admin UIs, and robust multi-tenant data isolation.

## Decision
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Validation**: Zod
- **Database**: MongoDB with Mongoose
- **Client State & Cache**: TanStack React Query v5
- **Styling**: Tailwind CSS with CSS Variable design tokens

## Alternatives Considered
- *Remix / React Router 7*: Excellent data loading, but Next.js App Router provides broader ecosystem compatibility and server actions.
- *PostgreSQL + Prisma*: Strong relational constraints; MongoDB selected for native JSON document configuration (`dashboardconfigs`) driving non-hardcoded admin interfaces.

## Tradeoffs
MongoDB allows instant real-time schema-less UI layout updates, but requires explicit application-level schema enforcement via Zod and Mongoose models.

## Status & Date
Approved — 2026-08-01
