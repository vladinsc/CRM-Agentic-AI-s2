"use client"

import useSWR from "swr"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchStats, type Stats } from "@/lib/api"
import {
  Cpu,
  Bell,
  Settings,
  ChevronDown,
  Plus,
} from "lucide-react"

export function CommandHeader() {
  const { data: stats } = useSWR<Stats>('stats', fetchStats, {
    refreshInterval: 30000,
  })

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      {/* Logo and title */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <Cpu className="size-5 text-primary" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-foreground">
            Agentic Command Center
          </h1>
          <p className="text-xs text-muted-foreground">
            AI-powered sales intelligence
          </p>
        </div>
      </div>

      {/* Center stats */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-score-hot animate-pulse" />
          <span className="text-xs text-muted-foreground">
            <span className="font-mono text-foreground">{stats?.hot_leads ?? '-'}</span> hot leads
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            AI: <span className="font-mono text-foreground">{stats?.ai_actions_today ?? '-'}</span> actiuni
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Pipeline: <span className="font-mono text-primary font-semibold">
              {stats ? `€${(stats.total_pipeline / 1000).toFixed(0)}K` : '-'}
            </span>
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5">
          <Plus className="size-3.5" />
          Add Lead
        </Button>
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {stats?.hot_leads ?? 0}
          </span>
        </Button>
        <Button variant="ghost" size="icon-sm">
          <Settings className="size-4" />
        </Button>
        <div className="ml-2 h-6 w-px bg-border hidden sm:block" />
        <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            A
          </div>
          <span className="text-sm">Admin</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
