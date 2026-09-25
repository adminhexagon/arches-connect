import { PEOPLE } from '../data/network'
import type { DemoPerson, Objective } from '../types'

export interface MatchResult {
  people: DemoPerson[]
  broadened: boolean
}

function score(person: DemoPerson, haystack: string): number {
  let total = person.priority
  for (const tag of person.tags) {
    if (tag.length > 2 && haystack.includes(tag)) total += 5
  }
  return total
}

export function matchPeople(objective: Objective): MatchResult {
  const pool = PEOPLE.filter((person) => person.kinds.includes(objective.kind))
  const broadened = pool.length === 0
  const source = broadened ? [...PEOPLE].sort((a, b) => b.priority - a.priority).slice(0, 3) : pool
  const haystack = `${objective.title} ${objective.context} ${objective.timing}`.toLowerCase()
  const people = [...source].sort((a, b) => {
    const delta = score(b, haystack) - score(a, haystack)
    if (delta !== 0) return delta
    return b.priority - a.priority
  })
  return { people, broadened }
}

export function stageForRank(index: number, person: DemoPerson): 'intro_proposed' | 'qualified' | 'researching' {
  if (index === 0) return 'intro_proposed'
  if (person.priority >= 6) return 'qualified'
  return 'researching'
}
