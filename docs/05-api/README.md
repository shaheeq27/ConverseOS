# ⚡ ConverseOS API v1 Standard

All endpoints follow the v1 JSON envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  },
  "requestId": "req_x9f2a_1785600000",
  "timestamp": "2026-08-01T15:30:00.000Z",
  "version": "v1"
}
```

## Route Index
- `POST /api/auth/login` — Authenticate user session
- `GET /api/auth/me` — Retrieve active session user
- `GET /api/admin/dashboard` — Fetch dynamic dashboard layout config
- `GET /api/conversations` — List workspace conversations
- `POST /api/messages` — Send user prompt & generate AI response
