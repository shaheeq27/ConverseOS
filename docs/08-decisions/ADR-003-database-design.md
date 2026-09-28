# ADR-003: Multi-Tenant Data Isolation & Schema Design

## Status
Accepted

## Context
ConverseOS must support strict multi-tenant isolation where users, assistants, conversations, messages, and configurations belong to isolated organizations and workspace slugs (`/[slug]`).

## Decision
- **Multi-Tenant Hierarchy**: `Organization` ➔ `Workspace` ➔ `UserRole` / `Assistant` / `Conversation` / `Message` / `DashboardConfig`.
- **Soft-Delete Support**: All primary entities include `deletedAt?: Date` and `createdBy?: string` to support soft-deleting without data corruption.
- **Extensible Footprint**: All models support a `metadata?: Record<string, unknown>` field for seamless migration-free feature additions.

## Status & Date
Approved — 2026-08-01
