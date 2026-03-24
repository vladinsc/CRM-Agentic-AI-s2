"use client"

import { useState } from "react"
import useSWR from "swr"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchLeads, type Lead } from "@/lib/api"
import {
  TrendingUp,
  Building2,
  Flame,
  Zap,
  Snowflake,
  ArrowUpRight,
  Loader2,
} from "lucide-react"

function getScoreColor(score: number) {
  if (score >= 80) return "text-score-hot"
  if (score >= 60) return "text-score-warm"
  return "text-score-cool"
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-score-hot/10 border-score-hot/30"
  if (score >= 60) return "bg-score-warm/10 border-score-warm/30"
  return "bg-score-cool/10 border-score-cool/30"
}

function getScoreIcon(score: number) {
  if (score >= 80) return Flame
  if (score >= 60) return Zap
  return Snowflake
}

interface LeadPipelineProps {
  selectedLead: Lead | null
  onSelectLead: (lead: Lead) => void
}

export function LeadPipeline({ selectedLead, onSelectLead }: LeadPipelineProps) {
  const { data: leads, isLoading, error } = useSWR('leads', fetchLeads, {
    refreshInterval: 60000,
  })
  const [filter, setFilter] = useState<"all" | "hot" | "warm" | "cool">("all")

  const filteredLeads = (leads || []).filter((lead) => {
    if (filter === "all") return true
    if (filter === "hot") return lead.score >= 80
    if (filter === "warm") return lead.score >= 60 && lead.score < 80
    return lead.score < 60
  })

  const stats = {
    hot: (leads || []).filter((l) => l.score >= 80).length,
    warm: (leads || []).filter((l) => l.score >= 60 && l.score < 80).length,
    cool: (leads || []).filter((l) => l.score < 60).length,
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">Eroare la incarcarea lead-urilor</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
              <TrendingUp className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Pipeline de Intentie
              </h2>
              <p className="text-xs text-muted-foreground">
                Sortat dupa probabilitatea de inchidere
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <>
                <span className="font-mono text-foreground">{leads?.length || 0}</span>
                <span className="text-muted-foreground">leads</span>
              </>
            )}
          </div>
        </div>

        {/* Score filter tabs */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              filter === "all"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Toate
          </button>
          <button
            onClick={() => setFilter("hot")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              filter === "hot"
                ? "bg-score-hot/20 text-score-hot"
                : "text-muted-foreground hover:text-score-hot"
            )}
          >
            <Flame className="size-3" />
            Hot ({stats.hot})
          </button>
          <button
            onClick={() => setFilter("warm")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              filter === "warm"
                ? "bg-score-warm/20 text-score-warm"
                : "text-muted-foreground hover:text-score-warm"
            )}
          >
            <Zap className="size-3" />
            Warm ({stats.warm})
          </button>
          <button
            onClick={() => setFilter("cool")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              filter === "cool"
                ? "bg-score-cool/20 text-score-cool"
                : "text-muted-foreground hover:text-score-cool"
            )}
          >
            <Snowflake className="size-3" />
            Cool ({stats.cool})
          </button>
        </div>
      </div>

      {/* Lead list */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const ScoreIcon = getScoreIcon(lead.score)
              const isSelected = selectedLead?.id === lead.id

              return (
                <button
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className={cn(
                    "w-full rounded-lg p-3 text-left transition-all",
                    isSelected
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-accent/50 border border-transparent"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Score indicator */}
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                        getScoreBg(lead.score)
                      )}
                    >
                      <ScoreIcon className={cn("size-5", getScoreColor(lead.score))} />
                    </div>

                    {/* Lead info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">
                          {lead.name}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-sm font-bold",
                            getScoreColor(lead.score)
                          )}
                        >
                          {lead.score}%
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="size-3" />
                        <span className="truncate">{lead.company}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-primary font-medium">
                          €{lead.deal_value.toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground truncate">
                        {lead.last_activity}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {lead.buying_signals.map((signal) => (
                          <Badge
                            key={signal}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5 border-border/50"
                          >
                            {signal}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Arrow indicator */}
                    <ArrowUpRight
                      className={cn(
                        "size-4 shrink-0 transition-all",
                        isSelected
                          ? "text-primary translate-x-0.5 -translate-y-0.5"
                          : "text-muted-foreground/50"
                      )}
                    />
                  </div>
                </button>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
