"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConversations } from "@/hooks";

export default function ChatIndexPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const { data: conversations, isLoading } = useConversations(params.slug);

  useEffect(() => {
    if (!isLoading && conversations && conversations.length > 0) {
      router.replace(`/${params.slug}/chat/${conversations[0]._id}`);
    }
  }, [conversations, isLoading, params.slug, router]);

  return (
    <div className="flex-1 flex items-center justify-center" data-testid="chat-welcome">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-600/20 border border-[var(--white-alpha-10)] flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path
                d="M6 10a3 3 0 013-3h18a3 3 0 013 3v12a3 3 0 01-3 3H22l-6 4v-4H9a3 3 0 01-3-3V10z"
                stroke="url(#grad)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="16" r="1.5" fill="var(--color-accent-cyan)" />
              <circle cx="18" cy="16" r="1.5" fill="var(--color-accent-violet)" />
              <circle cx="24" cy="16" r="1.5" fill="var(--color-accent-emerald)" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="36" y2="36">
                  <stop stopColor="var(--color-accent-cyan)" />
                  <stop offset="1" stopColor="var(--color-accent-violet)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-accent-emerald)] border-2 border-[var(--color-bg)] animate-pulse" />
        </div>

        <h2
          className="text-2xl font-bold text-[var(--color-text-primary)] mb-2"
          
        >
          AI Sales Assistant
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm mb-8 leading-relaxed">
          Your intelligent assistant is ready. Ask about inventory, orders,
          customer insights, or anything else.
        </p>

        <NewChatButton slug={params.slug} />
      </div>
    </div>
  );
}

function NewChatButton({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: conversations } = useConversations(slug);

  const startChat = async () => {
    // Fetch product instance, then create conversation
    const piRes = await fetch(`/api/projects/${slug}`);
    const piData = await piRes.json();
    if (!piData.data) return;

    // Get product instance
    const instRes = await fetch(`/api/integrations?slug=${slug}`);
    // Just navigate to chat and let it auto-create
    router.push(`/${slug}/chat/new`);
  };

  return (
    <button
      onClick={startChat}
      className="cursor-glow cursor-glow-sm inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      Start New Chat
    </button>
  );
}
