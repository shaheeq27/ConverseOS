# ADR-004: Authentication & Role-Based Access Control (RBAC)

## Status
Accepted

## Context
Enterprise operations require secure session management and role-based permissions (`owner`, `admin`, `manager`, `member`, `viewer`).

## Decision
- **Session Security**: HttpOnly HTTP cookies storing encrypted session references (`converseos_session`).
- **Authorization Engine**: Pure server-side functions in `src/lib/access/` that evaluate user role permissions without database side-effects.
- **Middleware Protection**: Dynamic slug route authorization enforcing role checks before server-rendering or handling API queries.

## Status & Date
Approved — 2026-08-01
