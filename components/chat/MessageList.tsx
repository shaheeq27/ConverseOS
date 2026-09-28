import { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { WelcomeMessage } from "./WelcomeMessage";
import React from "react";

import { Skeleton } from "@/components/ui/Skeleton";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isThinking: boolean;
  thinkingSteps: string[];
  projectName: string;
  bottomRef: React.RefObject<HTMLDivElement>;
}

export function MessageList({
  messages,
  isLoading,
  isThinking,
  thinkingSteps,
  projectName,
  bottomRef,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4" data-testid="messages-list">
      {isLoading && (
        <div className="space-y-4 py-4 animate-pulse">
          <div className="flex gap-3">
            <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" />
            <Skeleton className="h-16 w-2/3 rounded-2xl" style={{ borderRadius: "4px 18px 18px 18px" }} />
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" />
            <Skeleton className="h-10 w-1/2 rounded-2xl" style={{ borderRadius: "18px 4px 18px 18px" }} />
          </div>
          <div className="flex gap-3">
            <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" />
            <Skeleton className="h-24 w-3/4 rounded-2xl" style={{ borderRadius: "4px 18px 18px 18px" }} />
          </div>
        </div>
      )}

      {!isLoading && messages.length === 0 && !isThinking && (
        <WelcomeMessage projectName={projectName} />
      )}

      {messages.map((msg, i) => (
        <MessageBubble key={msg._id} message={msg} index={i} />
      ))}

      {isThinking && <ThinkingIndicator steps={thinkingSteps} />}

      <div ref={bottomRef} />
    </div>
  );
}
