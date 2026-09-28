# 🔤 Database Naming Standards

To maintain consistency across database collections, TypeScript interfaces, and runtime code, ConverseOS enforces explicit casing rules:

| Domain Layer | Convention | Examples |
| :--- | :--- | :--- |
| **Database Collections & Fields** | `snake_case` | `user_id`, `created_at`, `product_instances`, `dashboard_configs` |
| **TypeScript Variables & Functions** | `camelCase` | `userId`, `createdAt`, `productInstance`, `dashboardConfig` |
| **TypeScript Interfaces & Types** | `PascalCase` | `IUser`, `IProject`, `SessionUser`, `DashboardConfig` |
| **React Components & Files** | `PascalCase` | `ProjectSidebar.tsx`, `MessageBubble.tsx` |
| **API Endpoints** | `kebab-case` | `/api/product-instance`, `/api/auth/me` |
