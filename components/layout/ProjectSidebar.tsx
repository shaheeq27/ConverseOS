"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useConversations, useLogout } from "@/hooks";
import { SessionUser } from "@/types";
import { toast } from "@/components/ui/Toast";
import { clsx } from "clsx";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  slug: string;
  projectName: string;
  user: SessionUser;
  isAdmin: boolean;
}

function ConversationItem({
  conv,
  isActive,
  slug,
  collapsed
}: {
  conv: any;
  isActive: boolean;
  slug: string;
  collapsed: boolean;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/conversations/${conv._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      await queryClient.invalidateQueries({ queryKey: ["conversations", slug] });
      
      if (isActive) {
        router.push(`/${slug}/chat/new`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete conversation");
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div className="relative group">
      <Link
        href={`/${slug}/chat/${conv._id}`}
        className={clsx(
          "flex flex-col gap-0.5 px-3 py-2 rounded-lg transition-all duration-150 border border-transparent pr-8",
          isActive
            ? "sidebar-item-active"
            : "hover:bg-white/5 hover:border-white/5 text-[#9090a8] hover:text-white"
        )}
      >
        <span className="text-xs font-medium truncate">{conv.title}</span>
        {conv.lastMessage && (
          <span className="text-[11px] text-[#5a5a72] truncate">
            {conv.lastMessage}
          </span>
        )}
      </Link>
      
      <div className={clsx(
        "absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1",
        showConfirm ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
      )}>
        {showConfirm ? (
          <div className="flex bg-[#1a1a24] p-1 rounded-md border border-white/10 shadow-lg items-center gap-1 z-10">
            <span className="text-[9px] text-[#9090a8] px-1 whitespace-nowrap">Delete?</span>
            <button
              onClick={handleCancel}
              disabled={isDeleting}
              className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              No
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
            >
              {isDeleting ? "..." : "Yes"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="p-1 rounded-md text-[#5a5a72] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete conversation"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M2.5 4h11M5 4V2.5a1 1 0 011-1h4a1 1 0 011 1V4m-8 0v9a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5V4H5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function ProjectSidebar({ slug, projectName, user, isAdmin }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const { data: conversations = [] } = useConversations(slug);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout.mutateAsync();
    toast.success("Logged out");
    router.push("/login");
  };

  const isOnAdmin = pathname.includes("/admin");
  const isOnChat = pathname.includes("/chat");

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0d0d15] w-full flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L2 6v8l8 4 8-4V6l-8-4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 6l8 4 8-4M10 10v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-sm font-semibold text-white" >
            {projectName}
          </div>
        </div>
        <button
          onClick={() => {
            setCollapsed(false);
            setMobileOpen(true);
          }}
          className="text-[#5a5a72] hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "flex flex-col border-r border-white/5 transition-all duration-300",
          "fixed inset-y-0 left-0 z-50 md:relative md:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-[260px] md:w-[60px]" : "w-[260px]"
        )}
        style={{ background: "#0d0d15" }}
        data-testid="sidebar"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L2 6v8l8 4 8-4V6l-8-4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 6l8 4 8-4M10 10v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#5a5a72] font-medium">ConverseOS</div>
              <div
                className="text-sm font-semibold text-white truncate"
                
              >
                {projectName}
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-[#5a5a72] hover:text-white transition-colors ml-auto flex-shrink-0 hidden md:block"
            aria-label="Toggle sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d={collapsed ? "M6 3l5 5-5 5" : "M10 3L5 8l5 5"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-[#5a5a72] hover:text-white transition-colors ml-auto flex-shrink-0 md:hidden"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <div className="p-2 space-y-1">
          <NavItem
            href={`/${slug}/chat`}
            icon={<ChatIcon />}
            label="Chat"
            active={isOnChat}
            collapsed={collapsed}
            testId="nav-chat"
          />
          {isAdmin && (
            <NavItem
              href={`/${slug}/admin`}
              icon={<DashboardIcon />}
              label="Dashboard"
              active={isOnAdmin}
              collapsed={collapsed}
              badge="Admin"
              testId="nav-admin"
            />
          )}
        </div>

        {/* Conversations list */}
        {!collapsed && isOnChat && (
          <div className="flex-1 overflow-y-auto px-2 py-2" data-testid="conversation-list">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-[10px] font-semibold text-[#5a5a72] uppercase tracking-widest">
                Recent Chats
              </span>
              <Link
                href={`/${slug}/chat/new`}
                className="text-[#5a5a72] hover:text-cyan-400 hover:bg-cyan-400/10 p-1 rounded transition-colors"
                title="New Chat"
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            </div>
            {conversations.length === 0 ? (
              <div className="px-2 py-4 text-center">
                <p className="text-xs text-[#5a5a72]">No conversations yet</p>
                <p className="text-xs text-[#5a5a72] mt-1">Start a new chat below</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {conversations.map((conv) => (
                  <ConversationItem
                    key={conv._id}
                    conv={conv}
                    isActive={pathname.includes(conv._id)}
                    slug={slug}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!collapsed && !isOnChat && <div className="flex-1" />}
        {collapsed && <div className="flex-1" />}

        {/* User section */}
        <div className="p-3 border-t border-white/5">
          {collapsed ? (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2 rounded-lg hover:bg-white/5 transition-colors"
              title={user.name}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: user.avatarColor }}
              >
                {user.name[0]}
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: user.avatarColor }}
              >
                {user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">{user.name}</div>
                <div className="text-[10px] text-[#5a5a72] truncate">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-[#5a5a72] hover:text-[#f43f5e] transition-colors"
                title="Logout"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
  collapsed,
  badge,
  testId,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  badge?: string;
  testId?: string;
}) {
  return (
    <Link
      href={href}
      data-testid={testId}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 border",
        active
          ? "sidebar-item-active border-cyan-400/20"
          : "border-transparent hover:bg-white/5 hover:border-white/5 text-[#9090a8] hover:text-white"
      )}
    >
      <span className={clsx("flex-shrink-0", active ? "text-cyan-400" : "")}>
        {icon}
      </span>
      {!collapsed && (
        <>
          <span className="text-sm font-medium flex-1">{label}</span>
          {badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-400 border border-violet-500/20">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 2v-2H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}
