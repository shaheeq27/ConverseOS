import React from 'react';
import { cn } from "@/lib/utils/cn";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'full' | 'icon' | 'wordmark';
  theme?: 'dark' | 'light' | 'auto';
  hideTagline?: boolean;
}

export function ConverseLogo({ variant = 'full', theme = 'auto', hideTagline = false, className, ...props }: LogoProps) {
  const isAuto = theme === 'auto';
  const wordmarkColor = theme === 'dark' ? '#ffffff' : (theme === 'light' ? '#082f49' : 'currentColor');

  const Icon = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="cubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      <path
        d="M 84.64 30 L 50 10 L 15.36 30 L 15.36 70 L 50 90 L 84.64 70"
        stroke="url(#brandGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line x1="50" y1="34" x2="50" y2="10" stroke="url(#brandGrad)" strokeWidth="3" />
      <line x1="63.86" y1="42" x2="84.64" y2="30" stroke="url(#brandGrad)" strokeWidth="3" />
      <line x1="63.86" y1="58" x2="84.64" y2="70" stroke="url(#brandGrad)" strokeWidth="3" />
      <line x1="50" y1="66" x2="50" y2="90" stroke="url(#brandGrad)" strokeWidth="3" />
      <line x1="36.14" y1="58" x2="15.36" y2="70" stroke="url(#brandGrad)" strokeWidth="3" />
      <line x1="36.14" y1="42" x2="15.36" y2="30" stroke="url(#brandGrad)" strokeWidth="3" />

      <polygon points="50,34 63.86,42 50,50 36.14,42" fill="url(#cubeTop)" />
      <polygon points="50,50 63.86,42 63.86,58 50,66" fill="url(#cubeRight)" />
      <polygon points="36.14,42 50,50 50,66 36.14,58" fill="url(#cubeLeft)" />

      <circle cx="50" cy="10" r="6" fill="url(#brandGrad)" />
      <circle cx="84.64" cy="30" r="6" fill="url(#brandGrad)" />
      <circle cx="84.64" cy="70" r="6" fill="url(#brandGrad)" />
      <circle cx="50" cy="90" r="6" fill="url(#brandGrad)" />
      <circle cx="15.36" cy="70" r="6" fill="url(#brandGrad)" />
      <circle cx="15.36" cy="30" r="6" fill="url(#brandGrad)" />
    </svg>
  );

  const Wordmark = () => (
    <svg viewBox={hideTagline ? "0 0 350 70" : "0 0 350 90"} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="osGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <text x="0" y="60" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="54" fill={wordmarkColor} letterSpacing="-0.03em">
        Converse<tspan fill="url(#osGrad)">OS</tspan>
      </text>
      {!hideTagline && (
        <text x="3" y="82" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="12" fill={wordmarkColor} opacity="0.5" letterSpacing="0.25em">
          AI OPERATING SYSTEM
        </text>
      )}
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={cn("inline-flex items-center justify-center", className)} {...props}>
        <Icon />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn("inline-flex items-center justify-center", className)} {...props}>
        <Wordmark />
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)} {...props}>
      <div className="h-full aspect-square flex-shrink-0">
        <Icon />
      </div>
      <div 
        className="h-[60%] flex-shrink-0" 
        style={{ aspectRatio: hideTagline ? '350/70' : '350/90' }}
      >
        <Wordmark />
      </div>
    </div>
  );
}
