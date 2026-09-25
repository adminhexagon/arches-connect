import type { DemoPerson, Objective } from '../types'

function firstName(name: string): string {
  return name.split(' ')[0] ?? name
}

export function draftIntro(person: DemoPerson, objective: Objective): string {
  const mutualFirst = firstName(person.warmPath.mutual)
  const who = `${person.name} (${person.role} at ${person.company})`
  const close =
    "Would you be open to introducing us? I can send a short note you can forward. Fine if now isn't the moment."

  if (objective.kind === 'investors' && person.investment) {
    const fit = person.investment
    return `${mutualFirst} — I'm raising, and I'm looking for the right investor conversation: ${objective.title}.

${who} fits the round. Stage: ${fit.stage}. Check size: ${fit.checkSize}. Thesis: ${fit.thesis}. Geography: ${fit.geography}. ${person.whyNow} ${person.warmPath.shared}.

${close}`
  }

  if (objective.kind === 'leads') {
    return `${mutualFirst} — I'm looking for a buyer conversation: ${objective.title}.

${who} has a current reason to meet. ${person.whyNow} ${person.warmPath.shared}.

${close}`
  }

  if (objective.kind === 'resellers') {
    return `${mutualFirst} — I'm looking for a reseller who can carry this: ${objective.title}.

${who} looks like the right channel conversation. ${person.whyNow} ${person.warmPath.shared}.

${close}`
  }

  return `${mutualFirst} — I'm working on this objective: ${objective.title}.

${who} seems like the right conversation because ${person.whyNow} ${person.warmPath.shared}.

${close}`
}

export function draftFollowUp(person: DemoPerson, objective: Objective): string {
  const mutualFirst = firstName(person.warmPath.mutual)
  const theirName = firstName(person.name)
  if (objective.kind === 'investors' && person.investment) {
    const fit = person.investment
    return `${theirName} — grateful ${mutualFirst} connected us on the round: ${objective.title}. Your focus — ${fit.thesis}, ${fit.stage}, checks ${fit.checkSize} — is why I asked. ${person.whyNow}

Worth a short working session, or should we wait until the story is tighter?`
  }
  if (objective.kind === 'leads') {
    return `${theirName} — grateful ${mutualFirst} connected us. I'm still looking for the right buyer conversation: ${objective.title}. ${person.whyNow}

Worth a short working session, or should we wait?`
  }
  if (objective.kind === 'resellers') {
    return `${theirName} — grateful ${mutualFirst} connected us. I'm still looking for a reseller who can carry this: ${objective.title}. ${person.whyNow}

Worth a short working session on the channel, or should we wait?`
  }
  return `${theirName} — grateful ${mutualFirst} connected us. I'm still on this objective: ${objective.title}. ${person.whyNow}

Worth a short working session, or should we wait?`
}
