import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";

export default async function Home() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/15 to-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-violet-600/10 via-purple-500/10 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0a0a0f] rounded-[9px] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L2 6v8l8 4 8-4V6l-8-4z" stroke="url(#hero-grad)" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M2 6l8 4 8-4M10 10v8" stroke="url(#hero-grad)" strokeWidth="1.5" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="hero-grad" x1="2" y1="2" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#22d3ee"/>
                      <stop offset="1" stopColor="#a855f7"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <span className="text-[17px] font-[600] text-white tracking-tight" >
              Converse<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">OS</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/acme-corp/chat"
                className="px-5 py-2.5 text-[14px] font-[600] text-white bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-[10px] hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
              >
                Go to Workspace ({user.name})
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 text-[14px] font-[600] text-white bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-[10px] hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
              >
                Launch Demo Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-[1000px] mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[11px] font-[600] uppercase tracking-wide mb-[36px] shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          ENTERPRISE AI OPERATING SYSTEM
        </div>

        <h1 className="text-[clamp(40px,6vw,72px)] font-[800] text-white leading-[1.02] tracking-[-0.04em] mb-[28px] max-w-[950px] mx-auto">
          Empower Your Enterprise With <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500">
            Autonomous AI
          </span> Workspaces
        </h1>

        <p className="text-[18px] text-[#9090a8] max-w-[760px] mx-auto mb-[40px] leading-[1.6] font-[400]">
          ConverseOS provides an end-to-end multi-tenant AI platform designed for organizations to build, deploy, manage, and orchestrate intelligent AI assistants, knowledge bases, and real-time business integrations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 text-[15px] font-[600] text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all duration-200"
          >
            Explore Platform Demo
          </Link>
          <a
            href="https://github.com/shaheeq27/debates-ai-Full-Stack-Assignment"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 text-[15px] font-[600] text-[#f0f0f5] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            View Source Code
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-[56px]">
          <h2 className="text-[32px] font-[700] text-white mb-4 tracking-[-0.02em]">
            Engineered For Enterprise Scale
          </h2>
          <p className="text-[16px] text-[#9090a8] max-w-[600px] mx-auto font-[400] leading-[1.6]">
            Architected with a strict layered approach separating authorization rules, services, route handlers, and UI state.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-7 rounded-2xl bg-[#12121c] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <h3 className="text-[18px] font-[700] text-white mb-2 tracking-tight">
              Config-Driven Admin UI
            </h3>
            <p className="text-[14px] text-[#9090a8] leading-[1.6] font-[400]">
              No UI hardcoding. Admin dashboards are rendered dynamically from MongoDB configuration documents in real time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-2xl bg-[#12121c] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="text-[18px] font-[700] text-white mb-2 tracking-tight">
              Multi-Tenant Security
            </h3>
            <p className="text-[14px] text-[#9090a8] leading-[1.6] font-[400]">
              Complete organization and project isolation with pure authorization functions and role-based permissions (Admin / Member).
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-2xl bg-[#12121c] border border-white/5 hover:border-violet-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-5 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3 className="text-[18px] font-[700] text-white mb-2 tracking-tight">
              Real AI Orchestration
            </h3>
            <p className="text-[14px] text-[#9090a8] leading-[1.6] font-[400]">
              Integrated with Gemini and OpenRouter multi-model fallback routing for reliable real-time AI responses.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-[13px] text-[#5a5a72] font-[500]">
        <p>© 2026 ConverseOS — The Enterprise AI Operating System.</p>
      </footer>
    </div>
  );
}
