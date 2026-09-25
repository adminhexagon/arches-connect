const OBJECTIVE_MAX = 140
const DETAIL_MAX = 600

export function validateObjectiveTitle(title: string): string | null {
  const trimmed = title.trim()
  if (!trimmed) {
    return "Add an objective first. Say what you're trying to achieve — for example, win customers."
  }
  if (trimmed.length < 3 || !/[a-z0-9]/i.test(trimmed)) {
    return 'That objective is too thin. Use a few real words, like “raise a seed round” or “win customers”.'
  }
  if (trimmed.length > OBJECTIVE_MAX) {
    return `Keep the objective under ${OBJECTIVE_MAX} characters. You can add detail in the next step.`
  }
  return null
}

export function validateDetail(
  text: string,
  kind: 'context' | 'timing' | 'message' | 'preference' | 'draft' | 'note',
): string | null {
  const trimmed = text.trim()
  if (!trimmed) {
    if (kind === 'context') return "Add a little context so the fit isn't generic."
    if (kind === 'timing') return 'Add a rough timing, even if it’s “this quarter”.'
    if (kind === 'draft') return "The note can't be empty."
    if (kind === 'preference') return 'Write a preference before adding it.'
    if (kind === 'note') return 'Write a note before saving it.'
    return 'Write a message before sending.'
  }
  if ((kind === 'context' || kind === 'timing') && trimmed.length < 3) {
    return 'Add a little more detail so someone can be qualified properly.'
  }
  const max = kind === 'draft' || kind === 'context' ? DETAIL_MAX : 280
  if (trimmed.length > max) return `Keep that under ${max} characters.`
  return null
}
