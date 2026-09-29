import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { MouseFollowGlow } from "@/components/ui/MouseFollowGlow";
import { CursorGlow } from "@/components/ui/CursorGlow";

export const metadata: Metadata = {
  title: "ConverseOS — The Enterprise AI Operating System",
  description:
    "Production-ready enterprise AI workspace for AI assistants, RAG knowledge bases, multi-agent workflows, and business integrations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Inline script to set theme class before first paint — prevents flash */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light')}}catch(e){document.documentElement.classList.add('dark')}})();`,
          }}
        />
      </head>
      <body className="antialiased" style={{ background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
        <MouseFollowGlow />
        <CursorGlow />
        <ThemeProvider>
          <Providers>
            {children}
            <ToastProvider />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
