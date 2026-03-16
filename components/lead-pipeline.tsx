"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  Building2,
  User,
  Flame,
  Zap,
  Snowflake,
  ArrowUpRight,
} from "lucide-react"

export interface Lead {
  id: string
  name: string
  company: string
  score: number
  value: string
  lastActivity: string
  signals: string[]
  email: string
  phone: string
  role: string
  winningArgument: string
  draftMessage: string
}

const leads: Lead[] = [
  {
    id: "1",
    name: "Maria Ionescu",
    company: "TechCorp SRL",
    score: 94,
    value: "€45,000",
    lastActivity: "Viewed pricing page 3x today",
    signals: ["Budget Approved", "Decision Maker"],
    email: "maria.ionescu@techcorp.ro",
    phone: "+40 721 234 567",
    role: "CEO",
    winningArgument:
      "TechCorp has expanded 3x this year. They need automation to scale without hiring. Mention their competitor DataFlow just implemented similar solution.",
    draftMessage:
      "Hi Maria,\n\nI noticed TechCorp's impressive growth this year. DataFlow recently implemented our solution to handle their scaling challenges - I'd love to show you how we can help TechCorp achieve similar results without the overhead of expanding your team.\n\nWould Thursday at 2PM work for a quick call?\n\nBest regards",
  },
  {
    id: "2",
    name: "Alexandru Pop",
    company: "Global Solutions",
    score: 87,
    value: "€32,000",
    lastActivity: "Downloaded whitepaper yesterday",
    signals: ["Actively Researching", "Q1 Budget"],
    email: "alex.pop@globalsolutions.ro",
    phone: "+40 722 345 678",
    role: "CTO",
    winningArgument:
      "Technical buyer who values data security. Lead with SOC2 compliance and GDPR features. His team mentioned performance issues in recent review.",
    draftMessage:
      "Hi Alexandru,\n\nThanks for downloading our whitepaper on enterprise security. Given Global Solutions' focus on compliance, I wanted to highlight our SOC2 certification and built-in GDPR features.\n\nI'd love to walk you through our security architecture. Are you free for a 15-minute call this week?\n\nBest regards",
  },
  {
    id: "3",
    name: "Diana Radu",
    company: "InnovateTech",
    score: 81,
    value: "€28,000",
    lastActivity: "Requested demo 2 days ago",
    signals: ["Demo Requested", "Fast-Mover"],
    email: "diana.radu@innovatetech.ro",
    phone: "+40 723 456 789",
    role: "VP Operations",
    winningArgument:
      "Operations-focused buyer. Emphasize time savings and team productivity metrics. Their team works 12-hour days - efficiency is their pain point.",
    draftMessage:
      "Hi Diana,\n\nI'm preparing your demo and wanted to customize it for InnovateTech's operations needs. Our clients typically see 40% reduction in manual tasks within the first month.\n\nShould I focus the demo on workflow automation or team productivity features?\n\nLooking forward to showing you the platform!\n\nBest regards",
  },
  {
    id: "4",
    name: "Andrei Stanescu",
    company: "CloudFirst SRL",
    score: 73,
    value: "€52,000",
    lastActivity: "Opened 3 emails this week",
    signals: ["High Engagement", "Enterprise"],
    email: "andrei.stanescu@cloudfirst.ro",
    phone: "+40 724 567 890",
    role: "Director of Engineering",
    winningArgument:
      "Enterprise deal - needs stakeholder alignment. Suggest bringing in their CFO. Focus on ROI metrics and integration with existing stack.",
    draftMessage:
      "Hi Andrei,\n\nI've been analyzing CloudFirst's tech stack based on our previous conversations. I've prepared an integration roadmap that shows minimal disruption to your current workflows.\n\nWould it be helpful to include your CFO in our next call to discuss ROI projections?\n\nBest regards",
  },
  {
    id: "5",
    name: "Elena Mihai",
    company: "StartUp Innovation",
    score: 65,
    value: "€18,000",
    lastActivity: "Subscribed to newsletter",
    signals: ["Early Stage", "Growing Fast"],
    email: "elena.mihai@startupinno.ro",
    phone: "+40 725 678 901",
    role: "Founder",
    winningArgument:
      "Startup founder - price sensitive but growth-focused. Offer startup pricing tier. Mention case study of similar-stage company that scaled with us.",
    draftMessage:
      "Hi Elena,\n\nWelcome to our community! I noticed StartUp Innovation is in an exciting growth phase. We have a special startup program designed for companies at your stage.\n\nWould you like to hear how Rapid.io (similar stage last year) scaled their operations 5x using our platform?\n\nBest regards",
  },
  {
    id: "6",
    name: "Bogdan Popescu",
    company: "Digital Agency Pro",
    score: 58,
    value: "€24,000",
    lastActivity: "Visited site 2 weeks ago",
    signals: ["Needs Nurturing"],
    email: "bogdan.popescu@digitalagency.ro",
    phone: "+40 726 789 012",
    role: "Managing Partner",
    winningArgument:
      "Agency model - needs multi-client management features. Show white-label options. They lost a major client recently - timing could be right.",
    draftMessage:
      "Hi Bogdan,\n\nI hope Digital Agency Pro is having a great month! I wanted to share a quick update - we just launched white-label features that let agencies manage multiple clients from one dashboard.\n\nWould this be relevant for your team? Happy to give you a quick tour.\n\nBest regards",
  },
  {
    id: "7",
    name: "Cristina Dumitru",
    company: "NextGen Solutions",
    score: 42,
    value: "€38,000",
    lastActivity: "Cold outreach sent",
    signals: ["New Lead", "Target ICP"],
    email: "cristina.dumitru@nextgen.ro",
    phone: "+40 727 890 123",
    role: "Head of Digital",
    winningArgument:
      "Perfect ICP match but cold lead. Use industry-specific case study. Their company just announced digital transformation initiative.",
    draftMessage:
      "Hi Cristina,\n\nCongratulations on NextGen's digital transformation initiative! I work with several companies in your industry who have successfully modernized their operations.\n\nI'd love to share some insights that might be relevant to your goals. Would a brief call next week work?\n\nBest regards",
  },
]

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
  const [filter, setFilter] = useState<"all" | "hot" | "warm" | "cool">("all")

  const filteredLeads = leads.filter((lead) => {
    if (filter === "all") return true
    if (filter === "hot") return lead.score >= 80
    if (filter === "warm") return lead.score >= 60 && lead.score < 80
    return lead.score < 60
  })

  const stats = {
    hot: leads.filter((l) => l.score >= 80).length,
    warm: leads.filter((l) => l.score >= 60 && l.score < 80).length,
    cool: leads.filter((l) => l.score < 60).length,
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
                Intent Pipeline
              </h2>
              <p className="text-xs text-muted-foreground">
                Sorted by closing probability
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="font-mono text-foreground">{leads.length}</span>
            <span className="text-muted-foreground">leads</span>
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
            All
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
          {filteredLeads.map((lead) => {
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
                      <span className="text-primary font-medium">{lead.value}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      {lead.lastActivity}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lead.signals.map((signal) => (
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
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export { leads }
