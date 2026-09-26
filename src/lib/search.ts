import type { Objective, SearchRecord } from '../types'

function matchOne(text: string, pattern: RegExp): string {
  return text.match(pattern)?.[0]?.replace(/\s+/g, ' ').trim() ?? ''
}

export function buildSearch(objective: Objective): SearchRecord {
  const blob = `${objective.title}\n${objective.context}\n${objective.timing}`
  return {
    id: `search-${objective.id}`,
    objectiveId: objective.id,
    title: objective.title,
    kind: objective.kind,
    context: objective.context,
    timing: objective.timing,
    criteria: [objective.context, objective.timing].filter(Boolean).join(' · '),
    stage: matchOne(blob, /pre-seed|seed|series\s+[abc]/i),
    checkSize: matchOne(blob, /\$\s?\d[\d.,]*\s*(?:k|m|b)?(?:\s*[–-]\s*\$?\s?\d[\d.,]*\s*(?:k|m|b)?)?/i),
    thesis: objective.context,
    geography: matchOne(blob, /east coast|west coast|united states|u\.s\.|new york|london|europe|midwest|united kingdom/i),
    createdAt: objective.createdAt,
  }
}
