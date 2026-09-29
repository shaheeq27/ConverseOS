"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks";
import { toast } from "@/components/ui/Toast";

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
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden">
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 6v8l8 4 8-4V6l-8-4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M2 6l8 4 8-4M10 10v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[24px] font-[700] text-white tracking-tight">
              Converse<span className="text-cyan-400">OS</span>
            </span>
          </div>
          <h1 className="text-[32px] font-[800] text-white mb-3 tracking-tight">
            Choose your account
          </h1>
          <p className="text-[#9090a8] text-sm">
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
              <div className="glass glass-hover rounded-2xl p-5 transition-all duration-300 border border-white/5 hover:border-white/10 group-hover:translate-y-[-1px] relative overflow-hidden">
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
                      <span className="text-[17px] font-[700] text-white">
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
                    <p className="text-[#9090a8] text-sm">{user.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {user.projects.map((p) => (
                        <span
                          key={p}
                          className="text-xs text-[#5a5a72] bg-white/5 px-2 py-0.5 rounded-md"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="text-[#5a5a72] group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
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
          <p className="text-center text-[#5a5a72] text-xs mt-8">
            Unable to load demo accounts. Please try again.
          </p>
        ) : null}
      </div>
    </div>
  );
}
