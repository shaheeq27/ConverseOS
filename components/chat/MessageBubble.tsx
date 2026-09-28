import { Message } from "@/types";
import { clsx } from "clsx";

function FormattedContent({ content }: { content: string }) {
  // Simple markdown-like formatting
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex gap-3 animate-fade-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
    >
      {/* Avatar */}
      <div
        className={clsx(
          "w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold",
          isUser
            ? "bg-gradient-to-br from-violet-500 to-cyan-500 text-white"
            : "bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-white/10"
        )}
      >
        {isUser ? "U" : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5L8 2z" stroke="#22d3ee" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <div className={clsx("flex flex-col gap-1 max-w-[70%]", isUser ? "items-end" : "items-start")}>
        {/* Steps (for assistant messages) */}
        {!isUser && message.steps && message.steps.length > 0 && (
          <div className="flex flex-col gap-0.5 mb-1 w-full">
            {message.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#5a5a72]">
                <div className="w-1 h-1 rounded-full bg-cyan-400/50" />
                {step}
              </div>
            ))}
          </div>
        )}

        {/* Bubble */}
        <div
          className={clsx(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser ? "message-user text-white" : "message-assistant text-[#e0e0ed]"
          )}
          style={{
            borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
          }}
        >
          <FormattedContent content={message.content} />
        </div>

        <span className="text-[10px] text-[#5a5a72]">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
