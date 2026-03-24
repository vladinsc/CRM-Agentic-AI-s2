// Types matching FastAPI backend models
export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  score: number
  deal_value: number
  last_activity: string
  buying_signals: string[]
  winning_argument: string
  draft_message: string
}

export interface Activity {
  id: string
  type: string
  message: string
  lead_name?: string
  timestamp: string
  status: string
}

export interface CopilotResponse {
  winning_argument: string
  draft_message: string
  quick_insights: string[]
}

export interface Stats {
  total_leads: number
  hot_leads: number
  warm_leads: number
  total_pipeline: number
  ai_actions_today: number
  avg_score: number
}

// API fetcher functions
const API_BASE = '/api'

export async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch(`${API_BASE}/leads`)
  if (!res.ok) throw new Error('Failed to fetch leads')
  return res.json()
}

export async function fetchLead(id: string): Promise<Lead> {
  const res = await fetch(`${API_BASE}/leads/${id}`)
  if (!res.ok) throw new Error('Failed to fetch lead')
  return res.json()
}

export async function fetchActivities(): Promise<Activity[]> {
  const res = await fetch(`${API_BASE}/activities`)
  if (!res.ok) throw new Error('Failed to fetch activities')
  return res.json()
}

export async function fetchNewActivity(): Promise<Activity> {
  const res = await fetch(`${API_BASE}/activities/stream`)
  if (!res.ok) throw new Error('Failed to fetch new activity')
  return res.json()
}

export async function fetchCopilotInsights(leadId: string): Promise<CopilotResponse> {
  const res = await fetch(`${API_BASE}/copilot/${leadId}`)
  if (!res.ok) throw new Error('Failed to fetch copilot insights')
  return res.json()
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}
