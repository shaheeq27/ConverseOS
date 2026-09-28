# 🗄 ConverseOS Database Blueprint

## Entities & Soft Delete Standard

All primary collections/tables support the future-ready entity footprint:
- `id` / `_id`: Primary identifier
- `createdAt`: ISO Timestamp
- `updatedAt`: ISO Timestamp
- `createdBy`: User ID reference
- `deletedAt`: Soft-delete timestamp (null when active)
- `metadata`: Flexible JSON map for future extensibility

## Core Collections
1. `organizations`: Tenant root
2. `workspaces`: Sub-tenants / project instances
3. `users`: System users
4. `assistants`: Configured AI agents (system prompt, model, temperature, tools, knowledge sources)
5. `conversations`: Chat sessions
6. `messages`: Messages with attachments, sources, and tool execution metadata
7. `dashboardconfigs`: Dynamic layout definitions for admin command centers
