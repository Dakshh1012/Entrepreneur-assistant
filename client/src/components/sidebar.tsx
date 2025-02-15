/* eslint-disable prettier/prettier */
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Bot,
  Compass,
  Flag,
  Lightbulb,
  PiggyBank,
} from "lucide-react";

import { cn } from "../utlis.ts";

// Ordered by importance to founders
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Key metrics and overview",
  },
  {
    name: "Strategic Advice",
    href: "/strategic-advice",
    icon: Compass,
    description: "Growth and decision guidance",
  },
  {
    name: "Idea Validation",
    href: "/idea-validation",
    icon: Lightbulb,
    description: "Test your startup concepts",
  },
  {
    name: "Fundraising",
    href: "/fundraising",
    icon: PiggyBank,
    description: "Investment and capital",
  },
  {
    name: "Challenges",
    href: "/challenges",
    icon: Flag,
    description: "Overcome obstacles",
  },
  {
    name: "AI Assistant",
    href: "/assistant",
    icon: Bot,
    description: "Get instant help",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-1/5 border-r bg-background">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          AI Founder Assistant
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col gap-1 px-4 py-3 rounded-lg transition-colors",
                isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </div>
              <span
                className={cn(
                  "text-xs ml-8",
                  isActive ? "text-primary/80" : "text-muted-foreground"
                )}
              >
                {item.description}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
