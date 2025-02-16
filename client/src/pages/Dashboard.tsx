/* eslint-disable prettier/prettier */
import {
  Github,
  Twitter,
  Linkedin,
  TrendingUp,
  Users,
  Clock,
  Target,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Chip } from "@heroui/react";

import { cn } from "@/utlis";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Founder Profile */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-10 px-8 relative overflow-hidden">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_50%)]" />

        <div className="max-w-8xl mx-auto relative z-10">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/20" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                Alex Freeman
              </h1>
              <p className="text-lg text-blue-50 mb-3">
                Founder, AI Solutions Inc.
              </p>
              <div className="flex gap-5 mt-2">
                <a className="hover:text-blue-200 transition-colors" href="#">
                  <Github className="w-6 h-6" />
                </a>
                <a className="hover:text-blue-200 transition-colors" href="#">
                  <Twitter className="w-6 h-6" />
                </a>
                <a className="hover:text-blue-200 transition-colors" href="#">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg text-blue-50 mb-1">Startup Stage</div>
              <div className="text-2xl font-bold mb-1">Seed Phase</div>
              <div className="text-blue-50">Founded January 2024</div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the dashboard content remains the same */}
      <div className="max-w-8xl mx-auto p-8 space-y-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            change="+15% this month"
            changeType="positive"
            icon={TrendingUp}
            subtitle="Overall completion"
            title="Startup Progress"
            value="65%"
          />
          <MetricCard
            change="+5% this week"
            changeType="positive"
            icon={Target}
            subtitle="Idea strength score"
            title="Market Validation"
            value="85%"
          />
          <MetricCard
            change="2k new leads"
            changeType="neutral"
            icon={Users}
            subtitle="Potential customers"
            title="Target Users"
            value="10k+"
          />
          <MetricCard
            change="On schedule"
            changeType="neutral"
            icon={Clock}
            subtitle="Months remaining"
            title="Time to Market"
            value="4"
          />
        </div>

        {/* Detailed Information Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <h2 className="text-xl font-semibold">Startup Journey</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-8">
                <TimelineItem
                  date="Jan 2024"
                  description="Successfully validated market need"
                  status="completed"
                  title="Idea Validation"
                />
                <TimelineItem
                  date="Feb 2024"
                  description="Building core features"
                  status="in-progress"
                  title="MVP Development"
                />
                <TimelineItem
                  date="Mar 2024"
                  description="Planning user testing phase"
                  status="upcoming"
                  title="Beta Testing"
                />
                <TimelineItem
                  date="Apr 2024"
                  description="Go-to-market strategy"
                  status="upcoming"
                  title="Public Launch"
                />
              </div>
            </CardBody>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <h2 className="text-xl font-semibold">
                AI Insights & Recommendations
              </h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-8">
                <RecommendationItem
                  action="Set up user interviews"
                  description="Implement a feedback system in your MVP to gather early user insights"
                  priority="high"
                  title="Focus on User Feedback"
                />
                <RecommendationItem
                  action="Create content calendar"
                  description="Start building your content marketing pipeline"
                  priority="medium"
                  title="Prepare Marketing Strategy"
                />
                <RecommendationItem
                  action="Schedule meetings"
                  description="Connect with 3 potential investors this month"
                  priority="high"
                  title="Network Building"
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

// MetricCard component remains the same
function MetricCard({
  title,
  value,
  icon: Icon,
  subtitle,
  change,
  changeType,
}: {
  title: string;
  value: string;
  icon: any;
  subtitle: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}) {
  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-muted">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm text-muted-foreground mb-2">{subtitle}</div>
            <div
              className={cn(
                "text-sm font-medium",
                changeType === "positive" && "text-green-600",
                changeType === "negative" && "text-red-600"
              )}
            >
              {change}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// TimelineItem component remains the same
function TimelineItem({
  title,
  date,
  description,
  status,
}: {
  title: string;
  date: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
}) {
  return (
    <div className="flex gap-4">
      <div className="relative flex flex-col items-center">
        <div
          className={cn(
            "w-4 h-4 rounded-full border-2",
            status === "completed" && "bg-green-500 border-green-500",
            status === "in-progress" && "bg-blue-500 border-blue-500",
            status === "upcoming" && "bg-gray-200 border-gray-300"
          )}
        />
        {status !== "upcoming" && (
          <div className="w-0.5 h-full bg-gray-200 absolute top-4" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-semibold text-base">{title}</h3>
          <Chip className="uppercase text-xs font-medium" size="sm">
            {status}
          </Chip>
        </div>
        <div className="text-sm font-medium text-muted-foreground mb-1">
          {date}
        </div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

// RecommendationItem component remains the same
function RecommendationItem({
  title,
  description,
  priority,
  action,
}: {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold text-base">{title}</h3>
        <Chip
          className="uppercase text-xs font-medium"
          color={
            priority === "high"
              ? "danger"
              : priority === "medium"
                ? "warning"
                : "default"
          }
          size="sm"
        >
          {priority} priority
        </Chip>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      <div className="text-sm font-semibold text-primary">→ {action}</div>
    </div>
  );
}
