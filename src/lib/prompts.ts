import type { DemoPerson } from '../types'

export const WELCOME_TEXT =
  "What are you trying to achieve? Raise, win customers, find a partner or advisor, hire a provider — or say it in your own words."

export function contextPrompt(title: string): string {
  return `${title} is the objective. I'll work that — not just answer it.

What should I know so the fit is real? Share what you offer, and who has a reason to care right now.`
}

export function timingPrompt(): string {
  return 'When does this need to move? A week, this quarter, or whenever the right person shows up is enough.'
}

export function proposalPrompt(person: DemoPerson, broadened: boolean): string {
  const opener = broadened
    ? `Nothing in the demo graph matches that wording closely, so I used the strongest general fit instead of inventing someone. That's ${person.name}.`
    : `I looked through the demo graph — fictional people, not a live network — and qualified ${person.name}.`
  return `${opener}

${person.whyNow}

The intro needs your approval. Nothing is emailed from this preview.`
}

export function approvedPrompt(person: DemoPerson): string {
  return `Approved. ${person.name} is now Approved on your pipeline.

Next move: ask ${person.warmPath.mutual} for a warm intro to ${person.name}. The note stays on the card. Nothing was emailed.`
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
  return 'What are you trying to achieve next? The objective you already set stays on the list.'
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
