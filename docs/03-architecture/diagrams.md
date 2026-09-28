# 📊 ConverseOS Architecture Diagrams

## 1. High-Level System Architecture

```mermaid
graph TD
    Client[Browser Client - React + TanStack Query]
    Router[Next.js 14 App Router]
    Features[Feature Modules - src/features/*]
    ServerLayer[Server Services - src/server/*]
    AccessRules[Pure RBAC Rules - src/lib/access]
    MongoDB[(MongoDB Database)]
    AIEngine[AI Providers: Gemini / OpenRouter / OpenAI]

    Client --> Router
    Router --> Features
    Features --> ServerLayer
    ServerLayer --> AccessRules
    ServerLayer --> MongoDB
    ServerLayer --> AIEngine
```

---

## 2. Request Processing Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Middleware as Middleware (Auth Cookie)
    participant Route as Next.js Route Handler
    participant Service as Business Service
    participant Access as RBAC Access Layer
    participant DB as MongoDB

    User->>Middleware: HTTP Request
    Middleware->>Route: Validated Session
    Route->>Service: Execute Request
    Service->>Access: Check User Role & Permissions
    Access-->>Service: Permission Granted
    Service->>DB: Perform Query / Mutation
    DB-->>Service: Return Document
    Service-->>Route: Return Data Payload
    Route-->>User: Return Standard API Envelope
```

---

## 3. Chat Orchestration & AI Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant ChatUI as Chat Interface
    participant Service as AI Orchestration Service
    participant Memory as Memory & Context Store
    participant Gemini as Google Gemini / Provider
    participant DB as MongoDB

    User->>ChatUI: Send User Prompt
    ChatUI->>Service: POST /api/messages
    Service->>Memory: Load Conversation Context & History
    Service->>Gemini: Stream System Instruction + Prompt
    Gemini-->>Service: Generate AI Response
    Service->>DB: Save Message & Execution Metadata
    Service-->>ChatUI: Return Formatted AI Message & Steps
```

---

## 4. Authentication & Workspace Scope Flow

```mermaid
graph TD
    Login[User Selects Account] --> Cookie[Set HttpOnly Session Cookie]
    Cookie --> Request[Request /[slug]/chat]
    Request --> Middleware[Check Cookie & Validate User]
    Middleware --> WorkspaceCheck[Verify User Access to Project Slug]
    WorkspaceCheck -->|Authorized| Render[Render Workspace Dashboard]
    WorkspaceCheck -->|Unauthorized| Redirect[Redirect to /login]
```
