# 📐 ConverseOS System Design

## Overview
ConverseOS uses a micro-modular monolithic architecture built on Next.js 14 App Router, Next.js Route Handlers, MongoDB with Mongoose, and TanStack React Query.

```
┌────────────────────────────────────────────────────────────┐
│                    Client Browser (React)                  │
└──────────────┬─────────────────────────────▲───────────────┘
               │ HTTP API Calls (v1)         │ JSON Response
┌──────────────▼─────────────────────────────┴───────────────┐
│              Next.js 14 App Router & API Routes            │
├────────────────────────────────────────────────────────────┤
│  Feature Modules (src/features/*) & Server Services        │
├────────────────────────────────────────────────────────────┤
│  Access / RBAC Rules (Pure Authz Functions)                │
├────────────────────────────────────────────────────────────┤
│  Database Layer (Mongoose / MongoDB Collections)           │
└────────────────────────────────────────────────────────────┘
```
