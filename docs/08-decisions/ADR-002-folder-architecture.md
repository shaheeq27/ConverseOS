# ADR-002: Feature-Based Architecture & Server Layer Separation

## Status
Accepted

## Context
As ConverseOS expands across AI Assistants, RAG Knowledge Base, Multi-Agent Workflows, and Enterprise Analytics, monolithic top-level `components/` and `lib/` directories create tight coupling and poor maintainability.

## Decision
1. **Feature-Based Isolation (`src/features/`)**:
   Group code by business domain (`auth`, `dashboard`, `assistants`, `chat`, `knowledge`, `analytics`, `search`, `settings`, `organization`). Each feature contains its dedicated `components/`, `hooks/`, `actions/`, `types/`, and `utils/`.
2. **Server Layer Separation (`src/server/`)**:
   Isolate server-only code (`auth`, `db`, `repositories`, `services`, `ai`, `middleware`, `jobs`, `cache`) from client components.
3. **Config vs. Constants Split**:
   Separate dynamic/environment configuration (`src/config/`) from static domain constants (`src/constants/`).

## Alternatives Considered
- *Flat Directory Structure (`components/`, `lib/`, `pages/`)*: Hard to navigate as codebase grows beyond 50+ files.

## Status & Date
Approved — 2026-08-01
