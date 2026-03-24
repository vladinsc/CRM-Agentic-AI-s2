"use client"

import { useEffect, useState, useCallback } from "react"
import useSWR from "swr"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { fetchActivities, fetchNewActivity, type Activity } from "@/lib/api"
import {
  Search,
  Mail,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Brain,
  AlertTriangle,
  Database,
} from "lucide-react"

const activityIcons: Record<string, React.ElementType> = {
  research: Search,
  email_draft: Mail,
  analysis: FileText,
  signal: AlertTriangle,
  enrichment: Database,
  insight: Brain,
}

export function ActivityFeed() {
  const { data: initialActivities } = useSWR('activities', fetchActivities)
  const [activities, setActivities] = useState<Activity[]>([])
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)

  // Initialize activities when data loads
  useEffect(() => {
    if (initialActivities) {
      setActivities(initialActivities)
    }
  }, [initialActivities])

  // Simulate real-time activity stream from FastAPI
  const simulateNewActivity = useCallback(async () => {
    try {
      const newActivity = await fetchNewActivity()
      setCurrentActivity({ ...newActivity, status: "in-progress" })

      // Complete after 2-3 seconds
      setTimeout(() => {
        setCurrentActivity(null)
        setActivities((prev) => [
          { ...newActivity, status: "completed" },
          ...prev.slice(0, 9),
        ])
      }, 2000 + Math.random() * 1000)
    } catch (error) {
      console.error("Failed to fetch new activity:", error)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(simulateNewActivity, 8000)
    return () => clearInterval(interval)
  }, [simulateNewActivity])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Activitate AI</h2>
          <p className="text-xs text-muted-foreground">Lucrez autonom</p>
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
                  {currentActivity.lead_name && (
                    <p className="mt-0.5 truncate text-xs text-primary">
                      {currentActivity.lead_name}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">Lucrez...</p>
                </div>
              </div>
            </div>
          )}

          {/* Completed activities */}
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type] || FileText
            const isAlert = activity.status === "alert"
            
            return (
              <div
                key={activity.id}
                className={`group rounded-lg p-3 transition-colors ${
                  isAlert 
                    ? "bg-score-warm/10 border border-score-warm/20" 
                    : "hover:bg-accent/50"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                    isAlert ? "bg-score-warm/20" : "bg-secondary"
                  }`}>
                    <Icon className={`size-4 ${
                      isAlert 
                        ? "text-score-warm" 
                        : "text-muted-foreground group-hover:text-foreground"
                    } transition-colors`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      {!isAlert && <CheckCircle2 className="size-3.5 text-primary shrink-0" />}
                    </div>
                    {activity.lead_name && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {activity.lead_name}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {activity.timestamp}
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
