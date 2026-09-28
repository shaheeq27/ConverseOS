# ADR-005: Enterprise Design System & CSS Variable Tokens

## Status
Accepted

## Context
ConverseOS requires a high-impact, modern, enterprise aesthetic with instant dark mode support and theme switching capability.

## Decision
- **Theme Design Tokens**: Standardized CSS variables (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--radius`, `--shadow`) in `app/globals.css`.
- **Typography**: Brand headings styled with `Syne`, body text with `DM Sans` / `Inter`, code with `JetBrains Mono`.
- **Glassmorphism**: Backdrop filters (`backdrop-blur-xl`), subtle borders (`rgba(255,255,255,0.05)`), and cyan/violet radial ambient glows.

## Status & Date
Approved — 2026-08-01
