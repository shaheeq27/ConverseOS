"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

export function ToastProvider() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        style: {
          background: "#16161f",
          color: "#f0f0f5",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "0.75rem",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
        },
      }}
    />
  );
}

export { toast };
