import type { DemoPerson, Objective } from '../types'

export function personOpening(person: DemoPerson, objective: Objective | undefined): string {
  const warm = `${person.warmPath.mutual} (${person.warmPath.relationship})`
  const objectiveLine = objective ? `You're working on “${objective.title}.” ` : ''
  if (person.investment) {
    const fit = person.investment
    return `Demo reply — ${person.name} is a fictional profile, not a live investor.

${warm} is the warm path. ${person.warmPath.shared}. ${objectiveLine}I look at ${fit.thesis}. Stage: ${fit.stage}. Check size: ${fit.checkSize}. Geography: ${fit.geography}.

${person.whyNow} What should I know about the round?`
  }
  return `Demo reply — ${person.name} is a fictional profile, not a live contact.

${warm} is the warm path. ${person.warmPath.shared}. ${objectiveLine}${person.whyNow}`
}

export function personReply(person: DemoPerson, text: string): string {
  const lower = text.toLowerCase()
  const lines = ['Demo reply — this profile is fictional. Nothing in this thread is emailed.']
  if (/jordan|intro|warm|mutual/.test(lower)) {
    lines.push(`${person.warmPath.mutual} is the mutual on this path. ${person.warmPath.shared}.`)
  }
  if (person.investment && /check|seed|round|raise|stage|thesis|geo/.test(lower)) {
    const fit = person.investment
    lines.push(`For this demo profile the range is ${fit.checkSize} at ${fit.stage}. Thesis: ${fit.thesis}. Geography: ${fit.geography}.`)
  } else if (person.investment) {
    lines.push(`I can talk through ${person.investment.thesis}, or whether ${person.warmPath.mutual} should make the intro.`)
  } else if (/buyer|customer|reseller|channel|partner/.test(lower)) {
    lines.push(person.whyNow)
  } else {
    lines.push(`${person.whyNow} ${person.warmPath.mutual} can still make the introduction if you approve it with Connect.`)
  }
  return lines.join('\n\n')
}
