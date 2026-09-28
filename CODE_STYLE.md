# 📜 ConverseOS Engineering Standards & Code Style

## 1. Naming Conventions
- **Files & Directories**: `kebab-case` for general files/directories, `PascalCase` for React components (e.g. `Button.tsx`, `ProjectSidebar.tsx`).
- **Variables & Functions**: `camelCase` (e.g. `getSessionUser`, `generateAIResponse`).
- **Types & Interfaces**: `PascalCase` with `I` prefix for Mongoose documents if needed (e.g. `IUser`, `SessionUser`).
- **Constants**: `UPPER_SNAKE_CASE` (e.g. `SESSION_COOKIE`, `ROLES`).

## 2. Git Branch Strategy
- `main`: Production release branch.
- `develop`: Integration branch.
- `feature/*`: Feature development (e.g. `feature/auth-jwt`, `feature/rag-engine`).
- `fix/*`: Bug fixes (e.g. `fix/sidebar-toggle`, `fix/mongoose-warning`).
- `docs/*`: Documentation updates.

## 3. Commit Message Format
Strict conventional commits format:
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring without behavioral change
- `docs:` Documentation changes
- `style:` Formatting or design token changes
- `test:` Adding or updating tests
- `build:` Build system or dependency updates
