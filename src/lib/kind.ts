import type { ObjectiveKind } from '../types'

export interface ObjectiveChip {
  kind: ObjectiveKind
  title: string
  hint: string
}

export const OBJECTIVE_CHIPS: ObjectiveChip[] = [
  { kind: 'raise', title: 'Raise a round', hint: 'Investors actually taking meetings' },
  { kind: 'customers', title: 'Win customers', hint: 'Buyers with a current reason' },
  { kind: 'partners', title: 'Find a partner', hint: 'A channel or build partner' },
  { kind: 'advisors', title: 'Find an advisor', hint: 'Someone who should be close' },
  { kind: 'provider', title: 'Hire a provider', hint: 'A specialist worth introducing' },
]

export function inferKind(title: string): ObjectiveKind {
  const text = title.toLowerCase()
  if (/\b(raise|fundraising|fundraise|investor|seed round|series [a-c])\b/.test(text)) return 'raise'
  if (/\b(advisor|adviser|mentor)\b/.test(text)) return 'advisors'
  if (/\b(partner|partnership|co-sell|channel)\b/.test(text)) return 'partners'
  if (/\b(hire|provider|agency|freelancer|vendor|contractor)\b/.test(text)) return 'provider'
  if (/\b(customer|customers|client|clients|buyer|pipeline|logos)\b/.test(text)) return 'customers'
  return 'custom'
}
