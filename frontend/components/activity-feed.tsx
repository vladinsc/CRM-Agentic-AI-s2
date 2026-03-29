"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Mail,
  FileText,
  Phone,
  Sparkles,
  CheckCircle2,
  Clock,
  Brain,
} from "lucide-react"

interface Activity {
  id: string
  type: "research" | "email" | "analysis" | "call" | "insight"
  message: string
  leadName?: string
  timestamp: Date
  status: "completed" | "in-progress"
}

const activityIcons = {
  research: Search,
  email: Mail,
  analysis: FileText,
  call: Phone,
  insight: Brain,
}

const initialActivities: Activity[] = [
  {
    id: "1",
    type: "research",
    message: "Researched company profile",
    leadName: "TechCorp SRL",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    status: "completed",
  },
  {
    id: "2",
    type: "email",
    message: "Drafted personalized email",
    leadName: "Maria Ionescu",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: "completed",
  },
  {
    id: "3",
    type: "analysis",
    message: "Analyzed buying signals",
    leadName: "Global Solutions",
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    status: "completed",
  },
  {
    id: "4",
    type: "insight",
    message: "Identified decision maker",
    leadName: "StartUp Innovation",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    status: "completed",
  },
  {
    id: "5",
    type: "email",
    message: "Prepared follow-up sequence",
    leadName: "Digital Agency Pro",
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    status: "completed",
  },
]

const newActivityMessages = [
  { type: "research" as const, message: "Scanning LinkedIn activity" },
  { type: "email" as const, message: "Preparing email draft" },
  { type: "analysis" as const, message: "Updating closing score" },
  { type: "insight" as const, message: "Found new buying signal" },
  { type: "research" as const, message: "Checking recent news" },
]

const leadNames = [
  "Alexandru Pop",
  "InnovateTech",
  "CloudFirst SRL",
  "Diana Radu",
  "NextGen Solutions",
]

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)

  useEffect(() => {
    // Simulate real-time activity
    const interval = setInterval(() => {
      const randomActivity =
        newActivityMessages[Math.floor(Math.random() * newActivityMessages.length)]
      const randomLead = leadNames[Math.floor(Math.random() * leadNames.length)]

      const newActivity: Activity = {
        id: Date.now().toString(),
        type: randomActivity.type,
        message: randomActivity.message,
        leadName: randomLead,
        timestamp: new Date(),
        status: "in-progress",
      }

      setCurrentActivity(newActivity)

      // Complete after 2-3 seconds
      setTimeout(() => {
        setCurrentActivity(null)
        setActivities((prev) => [
          { ...newActivity, status: "completed" },
          ...prev.slice(0, 9),
        ])
      }, 2000 + Math.random() * 1000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Activity</h2>
          <p className="text-xs text-muted-foreground">Working autonomously</p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className="border-primary/30 text-primary">
            <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-primary" />
            Live
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {/* Current in-progress activity */}
          {currentActivity && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/20">
                  <Clock className="size-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {currentActivity.message}
                  </p>
                  {currentActivity.leadName && (
                    <p className="mt-0.5 truncate text-xs text-primary">
                      {currentActivity.leadName}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">Working...</p>
                </div>
              </div>
            </div>
          )}

          {/* Completed activities */}
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type]
            return (
              <div
                key={activity.id}
                className="group rounded-lg p-3 transition-colors hover:bg-accent/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                    </div>
                    {activity.leadName && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {activity.leadName}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
