import type { DemoPerson, ObjectiveKind } from '../types'

export const WELCOME_TEXT =
  "What should Connect get done for you? Investors are the place to start — VCs, angels, and funds. Clients and reseller partners are here when the objective changes."

export function contextPrompt(title: string, kind: ObjectiveKind): string {
  const lead = `${title} is the objective. I'll work that — not just answer it.`
  if (kind === 'investors') {
    return `${lead}

What should I know so the fit is real? Share the stage, the check size you're raising, the thesis, and where the round should land.`
  }
  if (kind === 'leads') {
    return `${lead}

Who is the buyer, and what pain is current enough that a meeting has a point?`
  }
  if (kind === 'resellers') {
    return `${lead}

What would a reseller carry, and which buyers already ask for it?`
  }
  return `${lead}

What should I know so the fit is real? Share what you offer, and who has a reason to care right now.`
}

export function timingPrompt(kind: ObjectiveKind): string {
  if (kind === 'investors') {
    return 'When does this need to move? This month, this quarter, or when the story is tighter is enough.'
  }
  if (kind === 'leads') {
    return 'When does the buyer need to move? A week, this quarter, or before their next planning cycle is enough.'
  }
  if (kind === 'resellers') {
    return 'When does the channel need to move? This month, this quarter, or when a joint customer is real is enough.'
  }
  return 'When does this need to move? A week, this quarter, or whenever the right person shows up is enough.'
}

export function proposalPrompt(person: DemoPerson, broadened: boolean): string {
  const opener = broadened
    ? `Nothing in the demo graph matches that wording closely, so I used the strongest general fit instead of inventing someone. That's ${person.name}.`
    : `I looked through the demo graph — fictional people, not a live network — and qualified ${person.name}.`
  const fit = person.investment
    ? ` Stage ${person.investment.stage}. Checks ${person.investment.checkSize}. Thesis: ${person.investment.thesis}. Geography: ${person.investment.geography}.`
    : ''
  return `${opener}${fit}

${person.whyNow}

The intro needs your approval. Nothing is emailed from this preview.`
}

export function approvedPrompt(person: DemoPerson): string {
  const ask = person.investment
    ? `ask ${person.warmPath.mutual} for a warm intro to ${person.name} about the round`
    : `ask ${person.warmPath.mutual} for a warm intro to ${person.name}`
  return `Approved. ${person.name} is now Approved on your pipeline.

Next move: ${ask}. The note stays on the card. Nothing was emailed.`
}

export function rejectedPrompt(name: string, next: DemoPerson | null, weak: boolean): string {
  if (!next) {
    return `Passed on ${name}. They're in Nurture. Nobody else in the demo graph is a strong enough fit to propose.`
  }
  const quality = weak
    ? 'The fit is weaker — they were still in research.'
    : 'They were already qualified.'
  return `Passed on ${name}. They're in Nurture.

Another person is ready: ${next.name}. ${quality} Approval still does not send anything.`
}

export function pausedPrompt(title: string): string {
  return `${title} is paused. Resume it from Objectives when you want this worked again. I won't qualify new people for it while it's paused.`
}

export function resumedPrompt(title: string): string {
  return `${title} is active again. I'll keep working from where we left off.`
}

export function donePrompt(title: string): string {
  return `Marked “${title}” done. The people on it stay in the pipeline so you can still see what happened.`
}

export function newObjectivePrompt(): string {
  return 'What are you trying to achieve next? Investors are still the strongest path. Lead generation and resellers are here too. The objective you already set stays on the list.'
}

export function noteReply(): string {
  return "This preview doesn't keep researching from a free-form note. Approve or pass on the intro that's waiting, or start a new objective. I won't invent a send."
}

export function introducedPrompt(person: DemoPerson): string {
  return `Marked the introduction to ${person.name} as made. That is your log, not a confirmation from ${person.warmPath.mutual}.

Follow-through: check in after they've had a moment. A draft is on the card. Logging it moves the pipeline to Following up.`
}

export function followLoggedPrompt(person: DemoPerson): string {
  return `Follow-through logged for ${person.name}. Pipeline is now Following up. Close it when the objective is resolved, or move it to Nurture if it should stay warm.`
}
