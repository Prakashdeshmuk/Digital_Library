import { useState } from "react";
import { Message } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface props {
  pageText?: string;
}

export function ChatInterface({ pageText }: props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          pageText: pageText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: `Error: ${error.message}`,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[676px] w-full max-w-2xl mx-auto bg-background border rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Chat Assistant</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
