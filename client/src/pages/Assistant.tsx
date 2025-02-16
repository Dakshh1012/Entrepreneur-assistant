/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button, Input } from "@heroui/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { cn } from "@/utlis";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your AI founder assistant. How can I help you today?",
      role: "assistant",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatbotResponse = async (prompt: string) => {
    try {
      const response = await axios.post("http://localhost:5000/assistant", {
        prompt,
      });

      return response.data.response;
    } catch (error) {
      console.error(
        "Error fetching chatbot response:",
        error.response?.data?.error || error.message
      );

      return "An error occurred while fetching response.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    const response = await fetchChatbotResponse(input);

    console.log(response);
    const assistantMessage: Message = {
      id: uuidv4(),
      content: response,
      role: "assistant",
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[80%] rounded-lg px-4 py-2",
                message.role === "assistant"
                  ? "bg-blue-100"
                  : "bg-primary text-primary-foreground ml-auto"
              )}
            >
              <ReactMarkdown className="prose">{message.content}</ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <form
          className="max-w-3xl mx-auto flex gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <Button className="shrink-0" type="button" variant="ghost">
            <Mic className="w-5 h-5" />
          </Button>
          <Input
            className="flex-1"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="shrink-0" type="submit">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AssistantPage;
