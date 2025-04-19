import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export function ChatMessage({ message }: { message: Message }) {
  console.log(message);
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {message.role === "user" ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        )}
        <span className="text-xs opacity-50">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
