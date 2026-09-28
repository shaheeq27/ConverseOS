import React from "react";
import { cn } from "@/lib/utils/cn";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export function Heading({ level = 1, className, children, ...props }: HeadingProps) {
  const styles = {
    1: "text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display",
    2: "text-3xl font-bold tracking-tight text-white font-display",
    3: "text-2xl font-semibold tracking-tight text-white font-display",
    4: "text-xl font-semibold text-white font-display",
    5: "text-lg font-medium text-white font-display",
    6: "text-base font-medium text-white font-display",
  };

  const combinedClass = cn(styles[level], className);

  switch (level) {
    case 1:
      return <h1 className={combinedClass} {...props}>{children}</h1>;
    case 2:
      return <h2 className={combinedClass} {...props}>{children}</h2>;
    case 3:
      return <h3 className={combinedClass} {...props}>{children}</h3>;
    case 4:
      return <h4 className={combinedClass} {...props}>{children}</h4>;
    case 5:
      return <h5 className={combinedClass} {...props}>{children}</h5>;
    case 6:
      return <h6 className={combinedClass} {...props}>{children}</h6>;
    default:
      return <h1 className={combinedClass} {...props}>{children}</h1>;
  }
}

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "primary" | "secondary" | "muted";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Text({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: TextProps) {
  const variantStyles = {
    primary: "text-[#f0f0f5]",
    secondary: "text-[#9090a8]",
    muted: "text-[#5a5a72]",
  };

  const sizeStyles = {
    sm: "text-xs leading-relaxed",
    md: "text-sm leading-relaxed",
    lg: "text-base leading-relaxed",
  };

  return (
    <p className={cn(variantStyles[variant], sizeStyles[size], className)} {...props}>
      {children}
    </p>
  );
}

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-xs font-semibold uppercase tracking-wider text-[#9090a8] block mb-1.5", className)} {...props}>
      {children}
    </label>
  );
}

export function Caption({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-[11px] text-[#5a5a72]", className)} {...props}>
      {children}
    </span>
  );
}

export function Code({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 rounded text-xs font-mono bg-white/5 border border-white/10 text-cyan-300",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
