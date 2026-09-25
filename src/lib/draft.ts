import type { DemoPerson, Objective } from '../types'

export function draftIntro(person: DemoPerson, objective: Objective): string {
  const mutualFirst = person.warmPath.mutual.split(' ')[0]
  return `${mutualFirst} — I'm working on this objective: ${objective.title}.

${person.name} (${person.role} at ${person.company}) seems like the right conversation because ${person.whyNow} ${person.warmPath.shared}.

Would you be open to introducing us? I can send a short note you can forward. Fine if now isn't the moment.`
}

export function draftFollowUp(person: DemoPerson, objective: Objective): string {
  const mutualFirst = person.warmPath.mutual.split(' ')[0]
  return `${person.name.split(' ')[0]} — grateful ${mutualFirst} connected us. I'm still on this objective: ${objective.title}. ${person.whyNow}

Worth a short working session, or should we wait?`
}
