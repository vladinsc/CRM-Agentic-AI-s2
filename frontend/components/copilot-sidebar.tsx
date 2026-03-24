"use client"

import { useState } from "react"
import type { Lead } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Wand2,
  Copy,
  Send,
  Phone,
  Mail,
  Building2,
  User,
  Target,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react"

interface CopilotSidebarProps {
  lead: Lead | null
  onClose: () => void
}

export function CopilotSidebar({ lead, onClose }: CopilotSidebarProps) {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [activeTab, setActiveTab] = useState<"argument" | "message">("argument")

  const handleCopyEmail = () => {
    if (lead) {
      // Replace escaped newlines with actual newlines
      const message = lead.draft_message.replace(/\\n/g, '\n')
      navigator.clipboard.writeText(message)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    }
  }

  if (!lead) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary mb-4">
          <Wand2 className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          AI Co-pilot Ready
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-[200px]">
          Selecteaza un lead din pipeline pentru a primi insight-uri personalizate si mesaje gata de trimis
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <ChevronRight className="size-4" />
          <span>Click pe orice lead pentru a incepe</span>
        </div>
      </div>
    )
  }

  // Format draft message (replace escaped newlines)
  const formattedMessage = lead.draft_message.replace(/\\n/g, '\n')

  return (
    <div className="flex h-full flex-col animate-in slide-in-from-right-4">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Co-pilot</h2>
              <p className="text-xs text-muted-foreground">Insight-uri AI</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Lead info card */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-lg">
                {lead.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{lead.name}</h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="size-3" />
                  <span className="truncate">{lead.company}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-sm font-bold shrink-0",
                  lead.score >= 80
                    ? "border-score-hot/50 text-score-hot"
                    : lead.score >= 60
                    ? "border-score-warm/50 text-score-warm"
                    : "border-score-cool/50 text-score-cool"
                )}
              >
                {lead.score}%
              </Badge>
            </div>

            {/* Quick actions */}
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`mailto:${lead.email}`)}
              >
                <Mail className="size-3.5" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => window.open(`tel:${lead.phone}`)}
              >
                <Phone className="size-3.5" />
                Suna
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-secondary/50 p-1 gap-1">
            <button
              onClick={() => setActiveTab("argument")}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                activeTab === "argument"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Target className="size-3.5" />
              Argument Castigator
            </button>
            <button
              onClick={() => setActiveTab("message")}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all flex items-center justify-center gap-1.5",
                activeTab === "message"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageSquare className="size-3.5" />
              Mesaj Draft
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === "argument" ? (
            <div className="space-y-4">
              {/* Winning argument */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="size-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Strategie Castigatoare
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {lead.winning_argument}
                </p>
              </div>

              {/* Signals breakdown */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Semnale de Cumparare
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lead.buying_signals.map((signal) => (
                    <Badge
                      key={signal}
                      variant="secondary"
                      className="gap-1"
                    >
                      <CheckCircle2 className="size-3 text-primary" />
                      {signal}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Deal value */}
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="text-xs text-muted-foreground mb-1">
                  Valoare Estimata Deal
                </div>
                <div className="text-2xl font-bold text-foreground">
                  €{lead.deal_value.toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Draft message */}
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      Email Personalizat
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Generat AI
                  </Badge>
                </div>
                <div className="text-sm text-foreground whitespace-pre-line leading-relaxed bg-secondary/30 rounded-md p-3 font-mono text-xs">
                  {formattedMessage}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleCopyEmail}
                >
                  {copiedEmail ? (
                    <>
                      <CheckCircle2 className="size-4 text-primary" />
                      Copiat!
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Copiaza
                    </>
                  )}
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={() => window.open(`mailto:${lead.email}?body=${encodeURIComponent(formattedMessage)}`)}
                >
                  <Send className="size-4" />
                  Trimite
                </Button>
              </div>
            </div>
          )}

          {/* Contact details */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Detalii Contact
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span className="text-foreground truncate">{lead.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <span className="text-foreground">{lead.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
