import type { ObjectiveKind } from '../types'

export interface ObjectiveChip {
  kind: ObjectiveKind
  title: string
  hint: string
  primary?: boolean
}

export const OBJECTIVE_CHIPS: ObjectiveChip[] = [
  {
    kind: 'investors',
    title: 'Meet investors',
    hint: 'VCs, angels, and funds taking meetings',
    primary: true,
  },
  {
    kind: 'leads',
    title: 'Lead generation',
    hint: 'Buyers with a current reason to meet',
  },
  {
    kind: 'resellers',
    title: 'Resellers',
    hint: 'Channel partners who can carry the offer',
  },
]

export function inferKind(title: string): ObjectiveKind {
  const text = title.toLowerCase()
  if (/\b(investor|investors|vc|vcs|venture|angel|angels|fund|funds|fundraising|fundraise|raise|seed round|pre-seed|series [a-c])\b/.test(text)) {
    return 'investors'
  }
  if (/\b(reseller|resellers|channel|distributor|var)\b/.test(text)) return 'resellers'
  if (/\b(lead|leads|customer|customers|client|clients|buyer|buyers|prospect|pipeline)\b/.test(text)) return 'leads'
  return 'custom'
}
