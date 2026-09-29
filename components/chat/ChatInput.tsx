"use client";

import { useEffect, useRef } from "react";
import { clsx } from "clsx";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isPending: boolean;
}

export function ChatInput({ input, setInput, handleSend, isPending }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const adjustHeight = () => {
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
    };
    adjustHeight();
    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-6 pb-6 pt-2 flex-shrink-0">
      <div className="relative glass rounded-2xl border border-white/10 focus-within:border-cyan-400/30 transition-all duration-200 flex items-end p-2 gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about inventory, orders, customers…"
          rows={1}
          className="flex-1 bg-transparent text-white text-sm placeholder-[#5a5a72] pl-3 py-2 resize-none focus:outline-none leading-relaxed"
          style={{ maxHeight: "200px", overflowY: "auto" }}
          data-testid="message-input"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isPending}
          className={clsx(
            "cursor-glow cursor-glow-sm flex-shrink-0 mb-1 mr-1 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
            input.trim() && !isPending
              ? "bg-gradient-to-br from-cyan-500 to-violet-600 text-white hover:opacity-90 shadow-sm"
              : "bg-white/5 text-[#5a5a72]"
          )}
          data-testid="send-button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7L2 2l2.5 5L2 12l10-5z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <p className="text-center text-[11px] text-[#5a5a72] mt-2">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
