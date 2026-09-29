import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "brand-gradient-bg text-white border border-white/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:brightness-110 hover:-translate-y-[1px]",
        secondary:
          "bg-[var(--white-alpha-05)] text-[var(--color-text-primary)] border border-[var(--white-alpha-10)] hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-500",
        outline:
          "border border-[var(--white-alpha-15)] text-[var(--color-text-primary)] bg-transparent hover:bg-cyan-500/5 hover:border-cyan-500/50 hover:text-cyan-500",
        ghost:
          "text-[var(--color-text-secondary)] hover:text-cyan-500 hover:bg-cyan-500/10",
        danger:
          "bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 hover:border-rose-500/30",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base font-semibold",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
