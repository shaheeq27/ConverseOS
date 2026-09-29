"use client";

import { useDashboard, useToggleIntegration } from "@/hooks";
import { DashboardSection, DashboardWidget } from "@/types";
import { toast } from "@/components/ui/Toast";
import { clsx } from "clsx";

import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminDashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data, isLoading, isError, refetch, isFetching } = useDashboard(params.slug);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto" data-testid="dashboard-loading">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>

          {/* Section 1 Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          {/* Section 2 Skeleton */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center" data-testid="dashboard-error">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 6v4M10 14h.01M3 17h14L10 3 3 17z" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[var(--color-text-primary)] font-semibold mb-1">Access Denied</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Admin access required</p>
        </div>
      </div>
    );
  }

  const config = data?.config;
  const stats = data?.stats as {
    stats: Record<string, number>;
    recentMessages: Array<{ _id: string; role: string; content: string; createdAt: string }>;
    integrations: Array<{ type: string; name: string; enabled: boolean }>;
    members: Array<{ userId: string; role: string; user?: { name: string; avatarColor: string } }>;
    activity: Array<{ date: string; count: number }>;
  };

  if (!config) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--color-text-secondary)] text-sm">No dashboard config found. Check your MongoDB seed.</p>
      </div>
    );
  }

  // Sort sections by order
  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  const handleRefresh = async () => {
    await refetch();
    toast.success("Dashboard refreshed");
  };

  return (
    <div className="flex-1 overflow-y-auto" data-testid="admin-dashboard">
      {/* Top bar */}
      <div className="px-8 py-6 border-b border-[var(--color-border)] flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">
              Admin Only
            </span>
          </div>
          <h1
            className="text-2xl font-bold text-[var(--color-text-primary)]"
            
            data-testid="dashboard-title"
          >
            {config.title}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Layout driven by{" "}
            <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded text-xs">
              dashboardconfigs
            </code>{" "}
            collection in MongoDB
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--white-alpha-05)] hover:bg-[var(--white-alpha-08)] border border-[var(--color-border)] rounded-xl transition-all disabled:opacity-50"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={clsx(isFetching && "animate-spin")}>
            <path d="M1 6a5 5 0 105-5 5 5 0 00-3.5 1.4M1 2.5V5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Config-driven sections */}
      <div className="px-8 py-6 space-y-8">
        {sortedSections.map((section, sectionIdx) => (
          <DashboardSectionRenderer
            key={section.id}
            section={section}
            stats={stats}
            slug={params.slug}
            sectionIdx={sectionIdx}
          />
        ))}
      </div>
    </div>
  );
}

function DashboardSectionRenderer({
  section,
  stats,
  slug,
  sectionIdx,
}: {
  section: DashboardSection;
  stats: {
    stats: Record<string, number>;
    recentMessages: Array<{ _id: string; role: string; content: string; createdAt: string }>;
    integrations: Array<{ type: string; name: string; enabled: boolean }>;
    activity: Array<{ date: string; count: number }>;
  };
  slug: string;
  sectionIdx: number;
}) {
  const sortedWidgets = [...section.widgets].sort((a, b) => a.order - b.order);

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${sectionIdx * 100}ms` }}
      data-testid={`section-${section.id}`}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <SectionIcon icon={section.icon} />
        <h2
          className="text-base font-bold text-[var(--color-text-primary)]"
          
        >
          {section.label}
        </h2>
        <div className="flex-1 h-px bg-[var(--white-alpha-05)]" />
        <span className="text-xs text-[var(--color-text-muted)]">{sortedWidgets.length} widget{sortedWidgets.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedWidgets.map((widget, widgetIdx) => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            stats={stats}
            slug={slug}
            widgetIdx={widgetIdx}
          />
        ))}
      </div>
    </div>
  );
}

function WidgetRenderer({
  widget,
  stats,
  slug,
  widgetIdx,
}: {
  widget: DashboardWidget;
  stats: {
    stats: Record<string, number>;
    recentMessages: Array<{ _id: string; role: string; content: string; createdAt: string }>;
    integrations: Array<{ type: string; name: string; enabled: boolean }>;
    activity: Array<{ date: string; count: number }>;
  };
  slug: string;
  widgetIdx: number;
}) {
  return (
    <div
      className="widget-enter"
      style={{ animationDelay: `${widgetIdx * 60}ms` }}
      data-testid={`widget-${widget.id}`}
    >
      {widget.type === "stat-card" && (
        <StatCard
          label={widget.label}
          value={stats?.stats?.[widget.dataKey] ?? 0}
          dataKey={widget.dataKey}
        />
      )}
      {widget.type === "integration-status" && (
        <IntegrationStatusCard integrations={stats?.integrations ?? []} />
      )}
      {widget.type === "toggle-list" && (
        <IntegrationToggleCard
          integrations={stats?.integrations ?? []}
          slug={slug}
        />
      )}
      {widget.type === "message-log" && (
        <MessageLogCard messages={stats?.recentMessages ?? []} label={widget.label} />
      )}
      {widget.type === "activity-chart" && (
        <ActivityChartCard label={widget.label} activity={stats?.activity ?? []} />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Widget components
// ──────────────────────────────────────────────

const STAT_META: Record<string, { color: string; icon: string; suffix?: string }> = {
  convCount:   { color: "#22d3ee", icon: "💬" },
  msgCount:    { color: "#8b5cf6", icon: "📨" },
  memberCount: { color: "#10b981", icon: "👥" },
  activeUsers: { color: "#f59e0b", icon: "⚡" },
};

function StatCard({ label, value, dataKey }: { label: string; value: number; dataKey: string }) {
  const meta = STAT_META[dataKey] ?? { color: "#22d3ee", icon: "📊" };
  return (
    <div
      className="cursor-glow glass rounded-2xl p-5 border border-transparent brand-gradient-border hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 relative overflow-hidden group"
      data-testid={`stat-${dataKey}`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `radial-gradient(circle at top left, ${meta.color}08, transparent 60%)` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl">{meta.icon}</span>
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
          />
        </div>
        <div
          className="text-3xl font-bold mb-1"
          style={{ color: meta.color }}
        >
          {value.toLocaleString()}
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">{label}</div>
      </div>
    </div>
  );
}

const INTEGRATION_ICONS: Record<string, string> = {
  shopify: "🛒",
  crm: "👤",
};

function getIntegrationIcon(type: string): string {
  return INTEGRATION_ICONS[type.toLowerCase()] || "🔌";
}

function IntegrationStatusCard({ integrations }: { integrations: Array<{ type: string; name: string; enabled: boolean }> }) {
  return (
    <div className="cursor-glow glass rounded-2xl p-5 border border-transparent brand-gradient-border hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 relative overflow-hidden group" data-testid="integration-status-card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🔌</span>
        <span className="text-sm font-semibold text-[var(--color-text-primary)]" >
          Integration Status
        </span>
      </div>
      <div className="space-y-3">
        {integrations.length === 0 && (
          <p className="text-xs text-[var(--color-text-muted)]">No integrations configured</p>
        )}
        {integrations.map((integ) => (
          <div key={integ.type} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">{getIntegrationIcon(integ.type)}</span>
              <span className="text-sm text-[var(--color-text-primary)]">{integ.name}</span>
            </div>
            <div
              className={clsx(
                "text-xs px-2 py-0.5 rounded-full font-medium border",
                integ.enabled
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-[var(--white-alpha-05)] text-[var(--color-text-muted)] border-[var(--color-border)]"
              )}
            >
              {integ.enabled ? "Active" : "Disabled"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationToggleCard({
  integrations,
  slug,
}: {
  integrations: Array<{ type: string; name: string; enabled: boolean }>;
  slug: string;
}) {
  const toggle = useToggleIntegration(slug);

  const handleToggle = async (type: "shopify" | "crm", current: boolean) => {
    try {
      await toggle.mutateAsync({ type, enabled: !current });
      toast.success(`${type} integration ${!current ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to update integration");
    }
  };

  return (
    <div className="cursor-glow glass rounded-2xl p-5 border border-transparent brand-gradient-border hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 relative overflow-hidden group" data-testid="integration-toggle-card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">⚙️</span>
        <span className="text-sm font-semibold text-[var(--color-text-primary)]" >
          Toggle Integrations
        </span>
      </div>
      <div className="space-y-3">
        {integrations.map((integ) => (
          <div key={integ.type} className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[var(--color-text-primary)]">{integ.name}</div>
              <div className="text-xs text-[var(--color-text-muted)] capitalize">{integ.type}</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={integ.enabled}
                onChange={() => handleToggle(integ.type as "shopify" | "crm", integ.enabled)}
                disabled={toggle.isPending}
                data-testid={`toggle-${integ.type}`}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageLogCard({
  messages,
  label,
}: {
  messages: Array<{ _id: string; role: string; content: string; createdAt: string }>;
  label: string;
}) {
  return (
    <div className="cursor-glow glass rounded-2xl p-5 border border-transparent brand-gradient-border hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 relative overflow-hidden group md:col-span-2 xl:col-span-3" data-testid="message-log-card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">📋</span>
        <span className="text-sm font-semibold text-[var(--color-text-primary)]" >
          {label}
        </span>
        <span className="ml-auto text-xs text-[var(--color-text-muted)]">{messages.length} messages</span>
      </div>
      {messages.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-4">No messages yet</p>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="flex items-start gap-3 py-2 border-b border-[var(--color-border)] last:border-0"
            >
              <span
                className={clsx(
                  "text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 mt-0.5",
                  msg.role === "user"
                    ? "bg-violet-500/15 text-violet-400"
                    : "bg-cyan-500/15 text-cyan-400"
                )}
              >
                {msg.role === "user" ? "User" : "AI"}
              </span>
              <p className="text-xs text-[var(--color-text-secondary)] flex-1 truncate">{msg.content}</p>
              <span className="text-[10px] text-[var(--color-text-muted)] flex-shrink-0">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityChartCard({ label, activity }: { label: string, activity?: Array<{ date: string; count: number }> }) {
  const data = activity && activity.length === 7 ? activity : Array(7).fill({ date: "-", count: 0 });
  const bars = data.map(d => d.count);
  
  const days = data.map(a => {
    if (a.date === "-") return "-";
    const [y, m, d] = a.date.split('-');
    const localDate = new Date(Number(y), Number(m) - 1, Number(d));
    return localDate.toLocaleDateString('en-US', { weekday: 'short' });
  });
  
  const max = Math.max(...bars, 10);

  return (
    <div className="cursor-glow glass rounded-2xl p-5 border border-transparent brand-gradient-border hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all duration-300 relative overflow-hidden group" data-testid="activity-chart-card">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">📈</span>
        <span className="text-sm font-semibold text-[var(--color-text-primary)]" >
          {label}
        </span>
      </div>
      <div className="flex items-end gap-1.5 h-20">
        {bars.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full rounded-sm transition-all duration-500 hover:opacity-80"
              style={{
                height: `${(val / max) * 64}px`,
                background: `linear-gradient(to top, rgba(34,211,238,0.6), rgba(139,92,246,0.4))`,
                minHeight: "4px",
              }}
            />
            <span className="text-[9px] text-[var(--color-text-muted)]">{days[i]}</span>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {val} msgs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    BarChart3: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="7" width="3" height="6" rx="0.5" fill="#22d3ee" opacity="0.7"/>
        <rect x="5.5" y="4" width="3" height="9" rx="0.5" fill="#22d3ee" opacity="0.85"/>
        <rect x="10" y="1" width="3" height="12" rx="0.5" fill="#22d3ee"/>
      </svg>
    ),
    Plug: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 1v3M9 1v3M3 4h8v3a4 4 0 01-8 0V4zM7 11v2" stroke="#8b5cf6" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    Activity: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 7h2l2-4 3 8 2-5 1 1h2" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return (
    <div className="w-6 h-6 rounded-lg bg-[var(--white-alpha-05)] flex items-center justify-center">
      {icons[icon] ?? <span className="text-xs">●</span>}
    </div>
  );
}
