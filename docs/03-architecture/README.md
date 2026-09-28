# 🏗 ConverseOS Architecture Blueprint

ConverseOS adheres to a strict **Feature-Based Architecture** and **Server Layer Separation**:

- `src/features/`: Modular, self-contained business domains (`auth`, `dashboard`, `assistants`, `chat`, `knowledge`, `analytics`, `search`, `settings`, `organization`).
- `src/server/`: Server-only infrastructure (`auth`, `db`, `repositories`, `services`, `ai`, `middleware`, `jobs`, `cache`).
- `src/config/`: Runtime and build configuration (`app.ts`, `env.ts`, `navigation.ts`, `theme.ts`, `features.ts`).
- `src/constants/`: Static constants (`roles.ts`, `permissions.ts`, `routes.ts`, `models.ts`).
