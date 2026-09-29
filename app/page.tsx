import { ConverseLogo } from "@/components/ui/ConverseLogo";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { AIDataGlobe } from "@/components/ui/AIDataGlobe";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default async function Home() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/15 to-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-violet-600/10 via-purple-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="border-b border-[var(--color-border)] bg-[var(--header-bg)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ConverseLogo className="h-10" variant="full" hideTagline />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ThemeToggle collapsed={true} variant="highlighted" />
            </div>
            {user ? (
              <Link
                href="/acme-corp/chat"
                className="cursor-glow cursor-glow-sm px-5 py-2.5 text-[14px] font-[600] text-white brand-gradient-bg border border-white/10 rounded-[10px] shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:brightness-110 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200"
              >
                Go to Workspace ({user.name})
              </Link>
            ) : (
              <Link
                href="/login"
                className="cursor-glow cursor-glow-sm px-5 py-2.5 text-[14px] font-[600] text-white brand-gradient-bg border border-white/10 rounded-[10px] shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:brightness-110 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200"
              >
                Launch Demo Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section — Split Layout */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-8">
        {/* Left Column — Text & CTAs */}
        <div className="flex-[1.3] lg:max-w-[58%] text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[11px] font-[600] uppercase tracking-wide mb-[36px] shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            ENTERPRISE AI OPERATING SYSTEM
          </div>

          <h1 className="text-[clamp(36px,5vw,68px)] font-[800] text-[var(--color-text-primary)] leading-[1.02] tracking-[-0.04em] mb-[28px]">
            Empower Your Enterprise With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500">
              Autonomous AI
            </span> Workspaces
          </h1>

          <p className="text-[18px] text-[var(--color-text-secondary)] max-w-[600px] mx-auto lg:mx-0 mb-[40px] leading-[1.6] font-[400]">
            ConverseOS provides an end-to-end multi-tenant AI platform designed for organizations to build, deploy, manage, and orchestrate intelligent AI assistants, knowledge bases, and real-time business integrations.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <Link
              href="/login"
              className="cursor-glow cursor-glow-sm w-full sm:w-auto px-8 py-3.5 text-[15px] font-[600] text-white brand-gradient-bg border border-white/10 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:brightness-110 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200"
            >
              Explore Platform Demo
            </Link>
            <a
              href="https://github.com/shaheeq27/debates-ai-Full-Stack-Assignment"
              target="_blank"
              rel="noreferrer"
              className="cursor-glow cursor-glow-sm w-full sm:w-auto px-8 py-3.5 text-[15px] font-[600] text-[var(--color-text-primary)] bg-[var(--white-alpha-05)] border border-[var(--white-alpha-10)] rounded-xl hover:bg-cyan-500/10 hover:text-cyan-500 hover:border-cyan-500/50 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-200"
            >
              View Source Code
            </a>
          </div>
        </div>

        {/* Right Column — 3D Globe */}
        <div className="flex-1 lg:max-w-[42%] w-full h-[380px] sm:h-[460px] lg:h-[580px] relative">
          <AIDataGlobe />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div className="text-center mb-[56px]">
          <h2 className="text-[32px] font-[700] text-[var(--color-text-primary)] mb-4 tracking-[-0.02em]">
            Engineered For Enterprise Scale
          </h2>
          <p className="text-[16px] text-[var(--color-text-secondary)] max-w-[600px] mx-auto font-[400] leading-[1.6]">
            Architected with a strict layered approach separating authorization rules, services, route handlers, and UI state.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="cursor-glow p-7 rounded-2xl bg-[var(--card-bg)] border border-transparent brand-gradient-border shadow-sm hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mb-5 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <h3 className="text-[18px] font-[700] text-[var(--color-text-primary)] mb-2 tracking-tight">
              Config-Driven Admin UI
            </h3>
            <p className="text-[14px] text-[var(--color-text-secondary)] leading-[1.6] font-[400]">
              No UI hardcoding. Admin dashboards are rendered dynamically from MongoDB configuration documents in real time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="cursor-glow p-7 rounded-2xl bg-[var(--card-bg)] border border-transparent brand-gradient-border shadow-sm hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mb-5 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="text-[18px] font-[700] text-[var(--color-text-primary)] mb-2 tracking-tight">
              Multi-Tenant Security
            </h3>
            <p className="text-[14px] text-[var(--color-text-secondary)] leading-[1.6] font-[400]">
              Complete organization and project isolation with pure authorization functions and role-based permissions (Admin / Member).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="cursor-glow p-7 rounded-2xl bg-[var(--card-bg)] border border-transparent brand-gradient-border shadow-sm hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mb-5 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3 className="text-[18px] font-[700] text-[var(--color-text-primary)] mb-2 tracking-tight">
              Real AI Orchestration
            </h3>
            <p className="text-[14px] text-[var(--color-text-secondary)] leading-[1.6] font-[400]">
              Integrated with Gemini and OpenRouter multi-model fallback routing for reliable real-time AI responses.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]/20 mt-16 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-600 p-[1px]">
                <div className="w-full h-full bg-[var(--color-bg)] rounded-[5px] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[var(--color-text-primary)]">OS</span>
                </div>
              </div>
              <span className="text-[15px] font-[700] tracking-tight text-[var(--color-text-primary)]">
                Converse<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">OS</span>
              </span>
            </div>
            <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">
              The enterprise-grade orchestration layer for managing, securing, and scaling AI assistants across your organization.
            </p>
          </div>
          <div>
            <h4 className="text-[14px] font-[600] text-[var(--color-text-primary)] mb-4">Platform</h4>
            <ul className="space-y-2 text-[13px] text-[var(--color-text-muted)]">
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[14px] font-[600] text-[var(--color-text-primary)] mb-4">Resources</h4>
            <ul className="space-y-2 text-[13px] text-[var(--color-text-muted)]">
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">API Reference</Link></li>
              <li>
                <a href="https://github.com/shaheeq27/debates-ai-Full-Stack-Assignment" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[14px] font-[600] text-[var(--color-text-primary)] mb-4">Legal</h4>
            <ul className="space-y-2 text-[13px] text-[var(--color-text-muted)]">
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[var(--color-text-muted)] font-[500]">
          <p>© {new Date().getFullYear()} ConverseOS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-[var(--color-text-primary)] transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-[var(--color-text-primary)] transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
