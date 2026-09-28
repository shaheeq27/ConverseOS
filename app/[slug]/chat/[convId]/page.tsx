"use client";

import { useState, useRef, useEffect } from "react";
import { useMessages, useSendMessage, useProject, useIntegrations } from "@/hooks";
import { Message } from "@/types";
import { toast } from "@/components/ui/Toast";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { clsx } from "clsx";

export default function ChatConversationPage({
  params,
}: {
  params: { slug: string; convId: string };
}) {
  const isNew = params.convId === "new";
  const [input, setInput] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(
    isNew ? null : params.convId
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: messages = [], isLoading } = useMessages(
    params.slug,
    currentConvId
  );
  const sendMessage = useSendMessage(params.slug);
  const { data: project } = useProject(params.slug);
  const { data: integrations = [] } = useIntegrations(params.slug);

  const allMessages = [...messages, ...optimisticMessages];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isThinking]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sendMessage.isPending) return;

    setInput("");
    setIsThinking(true);
    setThinkingSteps([]);

    // Optimistic user message
    const tempMsg: Message = {
      _id: `temp-${Date.now()}`,
      conversationId: currentConvId ?? "new",
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setOptimisticMessages([tempMsg]);

    // Simulate steps appearing
    const steps = [
      "Analyzing your message...",
      ...(integrations.find((i: {type:string;enabled:boolean}) => i.type === "shopify" && i.enabled)
        ? ["Fetching Shopify data..."]
        : []),
      ...(integrations.find((i: {type:string;enabled:boolean}) => i.type === "crm" && i.enabled)
        ? ["Querying CRM records..."]
        : []),
      "Generating response...",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setThinkingSteps((prev) => [...prev, steps[i]]);
    }

    try {
      const result = await sendMessage.mutateAsync({
        content,
        conversationId: currentConvId ?? undefined,
      });

      if (!currentConvId) {
        setCurrentConvId(result.conversationId);
        window.history.replaceState(
          {},
          "",
          `/${params.slug}/chat/${result.conversationId}`
        );
      }

      setOptimisticMessages([]);
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Failed to send message");
      setOptimisticMessages([]);
    } finally {
      setIsThinking(false);
      setThinkingSteps([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const enabledIntegrations = integrations.filter(
    (i: {enabled:boolean}) => i.enabled
  );

  return (
    <div className="flex flex-col h-full" data-testid="chat-view">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 2v-2H3a1 1 0 01-1-1V3z" stroke="#22d3ee" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white" >
              AI Sales Assistant
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-online" />
              <span className="text-xs text-[#5a5a72]">Online</span>
              {enabledIntegrations.length > 0 && (
                <span className="text-xs text-[#5a5a72]">
                  · {enabledIntegrations.map((i: {name:string}) => i.name).join(", ")} connected
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {integrations.map((integration: {type:string;name:string;enabled:boolean}) => (
            <div
              key={integration.type}
              className={clsx(
                "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border",
                integration.enabled
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-white/5 border-white/5 text-[#5a5a72]"
              )}
            >
              <div className={clsx("w-1.5 h-1.5 rounded-full", integration.enabled ? "bg-emerald-400" : "bg-[#5a5a72]")} />
              {integration.name}
            </div>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <MessageList
        messages={allMessages}
        isLoading={isLoading}
        isThinking={isThinking}
        thinkingSteps={thinkingSteps}
        projectName={project?.name ?? ""}
        bottomRef={bottomRef}
      />

      {/* Input area */}
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isPending={sendMessage.isPending}
      />
    </div>
  );
}

