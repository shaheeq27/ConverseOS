export function WelcomeMessage({ projectName }: { projectName: string }) {
  const suggestions = [
    "What products do we have in stock?",
    "Show me our recent orders",
    "Who are our top customers?",
    "What's our revenue this month?",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15 border border-white/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 3L2 8v10l10 5 10-5V8l-10-5z" stroke="url(#wg)" strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M2 8l10 5 10-5M12 13v9" stroke="url(#wg)" strokeWidth="1.2" strokeLinecap="round"/>
          <defs><linearGradient id="wg" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#22d3ee"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs>
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white mb-1" >
        How can I help you today?
      </h3>
      <p className="text-sm text-[#9090a8] mb-6">
        AI assistant for {projectName}
      </p>
      <div className="grid grid-cols-2 gap-2 max-w-sm w-full">
        {suggestions.map((s) => (
          <button
            key={s}
            className="cursor-glow cursor-glow-sm text-left text-xs text-[#9090a8] bg-white/5 hover:bg-white/8 border border-white/5 hover:border-white/10 rounded-xl px-3 py-2.5 transition-all duration-150 hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
