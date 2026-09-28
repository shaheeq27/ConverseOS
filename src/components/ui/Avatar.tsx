import React from "react";
import { cn } from "@/lib/utils/cn";
import { getInitials } from "@/lib/utils/string";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  isAI?: boolean;
  status?: "online" | "offline" | "busy" | "away";
  size?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
}

export function Avatar({
  src,
  name = "User",
  isAI = false,
  status,
  size = "md",
  backgroundColor,
  className,
  ...props
}: AvatarProps) {
  const sizeStyles = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-xs font-semibold",
    lg: "w-11 h-11 text-sm font-bold",
    xl: "w-14 h-14 text-base font-bold",
  };

  const statusStyles = {
    online: "bg-emerald-500",
    offline: "bg-gray-500",
    busy: "bg-rose-500",
    away: "bg-amber-500",
  };

  const statusSize = {
    sm: "w-2 h-2 border",
    md: "w-2.5 h-2.5 border-2",
    lg: "w-3 h-3 border-2",
    xl: "w-3.5 h-3.5 border-2",
  };

  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className={cn(
          "rounded-xl flex items-center justify-center text-white overflow-hidden select-none border border-white/10 shadow-md",
          sizeStyles[size],
          isAI
            ? "bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-600"
            : !src && !backgroundColor && "bg-gradient-to-br from-indigo-500 to-violet-600",
          className
        )}
        style={{ backgroundColor: !isAI && backgroundColor ? backgroundColor : undefined }}
        {...props}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : isAI ? (
          <svg width="60%" height="60%" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L2 6v8l8 4 8-4V6l-8-4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M2 6l8 4 8-4M10 10v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          getInitials(name)
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-[#0a0a0f]",
            statusStyles[status],
            statusSize[size]
          )}
        />
      )}
    </div>
  );
}
