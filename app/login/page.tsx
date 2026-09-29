"use client";
import { ConverseLogo } from "@/components/ui/ConverseLogo";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks";
import { toast } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const USERS = [
  {
    id: null as string | null,
    name: "Alice Kumar",
    email: "alice@converseos.ai",
    role: "Admin",
    color: "#0ea5e9",
    initial: "A",
    description: "Full access to all projects & admin dashboards",
    projects: ["Acme Corp", "TechFlow"],
  },
  {
    id: null as string | null,
    name: "Bob Chen",
    email: "bob@converseos.ai",
    role: "Admin",
    color: "#8b5cf6",
    initial: "B",
    description: "Admin at Acme Corp, member at TechFlow",
    projects: ["Acme Corp", "TechFlow"],
  },
  {
    id: null as string | null,
    name: "Carol Singh",
    email: "carol@acme.com",
    role: "Member",
    color: "#10b981",
    initial: "C",
    description: "Member access to Acme Corp only",
    projects: ["Acme Corp"],
  },
];

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [users, setUsers] = useState(USERS);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    fetch("/api/auth/users")
      .then(async (r) => {
        if (!r.ok) {
          setDbError(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data && data.data) {
          setUsers((prev) =>
            prev.map((u) => {
              const found = data.data.find(
                (d: { name: string; _id: string }) => d.name === u.name
              );
              return found ? { ...u, id: found._id } : u;
            })
          );
        }
      })
      .catch(() => {
        setDbError(true);
      })
      .finally(() => setIsFetchingUsers(false));
  }, []);

  const handleLogin = async (userId: string | null, name: string) => {
    if (!userId) {
      if (dbError) {
        toast.error("Database connection failed. Please try again later.");
      } else {
        toast.error("Unable to load this account. Please try again.");
      }
      return;
    }
    setSelecting(userId);
    try {
      await login.mutateAsync(userId);
      toast.success(`Welcome back, ${name}!`);
      window.location.href = "/acme-corp/chat";
    } catch {
      toast.error("Login failed. Check server logs or database connection.");
      setSelecting(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Theme Toggle — isolated from flex flow */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-50">
        <ThemeToggle collapsed={true} />
      </div>
      {/* Back to Home Navigation — isolated from flex flow */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-50">
        <Link
          href="/"
          aria-label="Back to Home"
          className="cursor-glow cursor-glow-sm inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--white-alpha-03)] border border-[var(--white-alpha-10)] hover:text-[var(--color-text-primary)] hover:border-cyan-500/30 hover:bg-[var(--white-alpha-08)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 4L4 8l6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Background effects */}
      <div
        className="gradient-blob w-[500px] h-[500px] opacity-20"
        style={{
          background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)",
          top: "-100px",
          left: "-100px",
        }}
      />
      <div
        className="gradient-blob w-[400px] h-[400px] opacity-15"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          bottom: "-50px",
          right: "-50px",
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
        {/* Logo */}
        <div className="text-center mb-12 flex flex-col items-center">
          <ConverseLogo className="h-12 mb-6" variant="full" />
          <h1 className="text-[32px] font-[800] text-[var(--color-text-primary)] mb-3 tracking-tight">
            Choose your account
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Demo login — select a user to explore the platform
          </p>
        </div>

        {/* User cards */}
        <div className="space-y-3">
          {users.map((user, i) => (
            <button
              key={user.email}
              onClick={() => handleLogin(user.id, user.name)}
              disabled={isFetchingUsers || !!selecting}
              className={`w-full text-left group ${isFetchingUsers ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ animationDelay: `${i * 80}ms` }}
              data-testid={`login-user-${user.name.split(" ")[0].toLowerCase()}`}
            >
              <div className="cursor-glow glass glass-hover rounded-2xl p-5 transition-all duration-300 border border-transparent brand-gradient-border group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] relative overflow-hidden">
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at left center, ${user.color}10 0%, transparent 60%)`,
                  }}
                />

                <div className="relative flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${user.color}30, ${user.color}60)`,
                      border: `1px solid ${user.color}40`,
                    }}
                  >
                    {selecting !== null && selecting === user.id ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      user.initial
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[17px] font-[700] text-[var(--color-text-primary)]">
                        {user.name}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${user.color}20`,
                          color: user.color,
                          border: `1px solid ${user.color}30`,
                        }}
                      >
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-sm">{user.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {user.projects.map((p) => (
                        <span
                          key={p}
                          className="text-xs text-[var(--color-text-muted)] bg-[var(--white-alpha-05)] px-2 py-0.5 rounded-md"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-[var(--color-text-muted)] group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7 10h6M10 7l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        {dbError ? (
          <p className="text-center text-red-400 text-xs mt-8 font-medium">
            Database connection failed. Please check Vercel logs or MongoDB network access.
          </p>
        ) : (!isFetchingUsers && users.some((u) => !u.id)) ? (
          <p className="text-center text-[var(--color-text-muted)] text-xs mt-8">
            Unable to load demo accounts. Please try again.
          </p>
        ) : null}
      </div>
    </div>
  );
}
