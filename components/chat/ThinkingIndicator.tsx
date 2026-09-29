export function ThinkingIndicator({ steps }: { steps: string[] }) {
  return (
    <div className="flex gap-3 animate-fade-up">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-[var(--white-alpha-10)] flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5L8 2z" stroke="var(--color-accent-cyan)" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex flex-col gap-1.5 max-w-[70%]">
        {/* Steps */}
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] animate-fade-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="w-1 h-1 rounded-full bg-cyan-400/50" />
            {step}
          </div>
        ))}

        {/* Typing dots */}
        <div className="message-assistant px-4 py-3 rounded-2xl inline-flex items-center gap-1.5" style={{ borderRadius: "4px 18px 18px 18px" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-secondary)] typing-dot" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-secondary)] typing-dot" />
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-secondary)] typing-dot" />
        </div>
      </div>
    </div>
  );
}

