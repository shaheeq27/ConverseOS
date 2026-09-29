import { ConverseLogo } from "@/components/ui/ConverseLogo";
export function WelcomeMessage({ projectName }: { projectName: string }) {
  const suggestions = [
    "What products do we have in stock?",
    "Show me our recent orders",
    "Who are our top customers?",
    "What's our revenue this month?",
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-4">
        <ConverseLogo className="h-16 w-16" variant="icon" />
      </div>
      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1" >
        How can I help you today?
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        AI assistant for {projectName}
      </p>
      <div className="grid grid-cols-2 gap-2 max-w-sm w-full">
        {suggestions.map((s) => (
          <button
            key={s}
            className="cursor-glow cursor-glow-sm text-left text-xs text-[var(--color-text-secondary)] bg-[var(--white-alpha-05)] hover:bg-[var(--white-alpha-08)] border border-[var(--color-border)] hover:border-[var(--white-alpha-10)] rounded-xl px-3 py-2.5 transition-all duration-150 hover:text-[var(--color-text-primary)]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

