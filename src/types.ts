export type ObjectiveKind = 'investors' | 'leads' | 'resellers' | 'custom'

export interface InvestmentProfile {
  stage: string
  checkSize: string
  thesis: string
  geography: string
}

export type ObjectiveStatus = 'active' | 'paused' | 'done'

export type PipelineStage =
  | 'researching'
  | 'qualified'
  | 'intro_proposed'
  | 'approved'
  | 'introduced'
  | 'following_up'
  | 'closed'
  | 'nurture'

export type Phase = 'awaiting_objective' | 'awaiting_context' | 'awaiting_timing' | 'active'

export interface Objective {
  id: string
  title: string
  kind: ObjectiveKind
  status: ObjectiveStatus
  context: string
  timing: string
  createdAt: string
}

export interface WarmPath {
  mutual: string
  relationship: string
  shared: string
}

export interface DemoPerson {
  id: string
  name: string
  role: string
  company: string
  location: string
  kinds: ObjectiveKind[]
  priority: number
  whyNow: string
  fitForYou: string
  fitForThem: string
  warmPath: WarmPath
  tags: string[]
  investment?: InvestmentProfile
}

export interface Activity {
  id: string
  at: string
  label: string
}

export interface Opportunity {
  id: string
  personId: string
  objectiveId: string
  stage: PipelineStage
  whyNow: string
  reasonYou: string
  reasonThem: string
  mutual: string
  relationship: string
  shared: string
  draft: string
  followUpDraft: string
  createdAt: string
  updatedAt: string
  activity: Activity[]
}

export interface ChatMessage {
  id: string
  role: 'agent' | 'user'
  text: string
  at: string
  opportunityId?: string
  followThroughId?: string
}

export interface Memory {
  objectiveSummary: string
  summaryCustom: boolean
  preferences: string[]
  outcomes: string[]
}

export interface AppData {
  objectives: Objective[]
  opportunities: Opportunity[]
  messages: ChatMessage[]
  memory: Memory
  phase: Phase
  activeObjectiveId: string | null
}

export const STAGE_LABEL: Record<PipelineStage, string> = {
  researching: 'Researching',
  qualified: 'Qualified',
  intro_proposed: 'Intro proposed',
  approved: 'Approved',
  introduced: 'Introduced',
  following_up: 'Following up',
  closed: 'Closed',
  nurture: 'Nurture',
}

export const STAGES: PipelineStage[] = [
  'researching',
  'qualified',
  'intro_proposed',
  'approved',
  'introduced',
  'following_up',
  'closed',
  'nurture',
]

export const KIND_LABEL: Record<ObjectiveKind, string> = {
  investors: 'Investors',
  leads: 'Lead generation',
  resellers: 'Resellers',
  custom: 'Custom',
}

export const STATUS_LABEL: Record<ObjectiveStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  done: 'Done',
}
