import type { AppData, Memory, ObjectiveKind, Phase } from '../types'

export const STORAGE_KEY = 'arches-connect.v1'

export const READ_ERROR =
  "Saved workspace couldn't be read. This session won't overwrite it until you replace the saved data."

export const WRITE_ERROR =
  "Couldn't save to this browser. Your latest changes stay in this tab only."

const PHASES: Phase[] = ['awaiting_objective', 'awaiting_context', 'awaiting_timing', 'active']

const LEGACY_KIND: Record<string, ObjectiveKind> = {
  investors: 'investors',
  leads: 'leads',
  resellers: 'resellers',
  custom: 'custom',
  raise: 'investors',
  customers: 'leads',
  partners: 'resellers',
  advisors: 'custom',
  provider: 'custom',
}

function normalizeKind(value: unknown): ObjectiveKind {
  if (typeof value === 'string' && value in LEGACY_KIND) return LEGACY_KIND[value]
  return 'custom'
}

function isMemory(value: unknown): value is Memory {
  if (!value || typeof value !== 'object') return false
  const memory = value as Memory
  return (
    typeof memory.objectiveSummary === 'string' &&
    Array.isArray(memory.preferences) &&
    Array.isArray(memory.outcomes)
  )
}

export function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false
  const data = value as AppData
  return (
    Array.isArray(data.objectives) &&
    Array.isArray(data.opportunities) &&
    Array.isArray(data.messages) &&
    isMemory(data.memory) &&
    PHASES.includes(data.phase) &&
    (data.activeObjectiveId === null || typeof data.activeObjectiveId === 'string')
  )
}

export function normalizeData(data: AppData): AppData {
  return {
    ...data,
    objectives: data.objectives.map((objective) => ({
      ...objective,
      kind: normalizeKind(objective.kind),
    })),
    memory: {
      objectiveSummary: data.memory.objectiveSummary ?? '',
      summaryCustom: Boolean(data.memory.summaryCustom),
      preferences: data.memory.preferences ?? [],
      outcomes: data.memory.outcomes ?? [],
    },
  }
}

export function readState(): { data: AppData | null; error: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { data: null, error: null }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { data: null, error: READ_ERROR }
    const envelope = parsed as { version?: number; data?: unknown }
    if (envelope.version !== 1 || !isAppData(envelope.data)) return { data: null, error: READ_ERROR }
    return { data: normalizeData(envelope.data), error: null }
  } catch {
    return { data: null, error: READ_ERROR }
  }
}

export function writeState(data: AppData): string | null {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, data }))
    return null
  } catch {
    return WRITE_ERROR
  }
}

export function clearState(): string | null {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return null
  } catch {
    return "Couldn't clear saved data in this browser."
  }
}
