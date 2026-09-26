import { getPerson } from '../data/network'
import { draftFollowUp, draftIntro } from '../lib/draft'
import { now, uid } from '../lib/ids'
import { inferKind } from '../lib/kind'
import { matchPeople, qualifyLimit, stageForRank } from '../lib/match'
import { personOpening, personReply } from '../lib/personReply'
import { buildSearch } from '../lib/search'
import {
  WELCOME_TEXT,
  approvedPrompt,
  contextPrompt,
  donePrompt,
  followLoggedPrompt,
  introducedPrompt,
  newObjectivePrompt,
  noteReply,
  pausedPrompt,
  proposalPrompt,
  rejectedPrompt,
  resumedPrompt,
  timingPrompt,
} from '../lib/prompts'
import { validateDetail, validateObjectiveTitle } from '../lib/validate'
import type {
  Activity,
  AppData,
  ChatMessage,
  DemoPerson,
  Memory,
  Objective,
  ObjectiveKind,
  ObjectiveStatus,
  Opportunity,
  PersonThread,
  Phase,
  PipelineStage,
} from '../types'

export type Action =
  | { type: 'submit_objective'; title: string; kind?: ObjectiveKind }
  | { type: 'submit_context'; text: string }
  | { type: 'submit_timing'; text: string }
  | { type: 'send_note'; text: string }
  | { type: 'create_objective'; title: string }
  | { type: 'set_status'; id: string; status: ObjectiveStatus }
  | { type: 'select_objective'; id: string }
  | { type: 'start_new_objective' }
  | { type: 'approve_intro'; opportunityId: string }
  | { type: 'reject_intro'; opportunityId: string }
  | { type: 'edit_intro'; opportunityId: string; draft: string }
  | { type: 'mark_introduced'; opportunityId: string }
  | { type: 'log_follow_up'; opportunityId: string }
  | { type: 'move_stage'; opportunityId: string; stage: 'nurture' | 'closed' }
  | { type: 'propose_intro'; opportunityId: string }
  | { type: 'add_preference'; text: string }
  | { type: 'remove_preference'; text: string }
  | { type: 'add_outcome_note'; text: string }
  | { type: 'set_summary'; text: string }
  | { type: 'use_generated_summary' }
  | { type: 'open_thread'; opportunityId: string }
  | { type: 'send_person_message'; threadId: string; text: string }
  | { type: 'hydrate'; data: AppData }
  | { type: 'reset' }

function message(role: ChatMessage['role'], text: string, extra?: Partial<ChatMessage>): ChatMessage {
  return { id: uid('msg'), role, text, at: now(), ...extra }
}

function act(label: string): Activity {
  return { id: uid('act'), at: now(), label }
}

export function summarize(objective: Objective): string {
  const bits = [objective.title]
  if (objective.context) bits.push(objective.context)
  if (objective.timing) bits.push(`Timing: ${objective.timing}`)
  return bits.join(' — ')
}

function generatedSummary(data: AppData): string {
  const active = data.objectives.find((objective) => objective.id === data.activeObjectiveId)
  return active ? summarize(active) : ''
}

function withMemory(data: AppData, memory: Memory): AppData {
  const next = { ...data, memory }
  if (memory.summaryCustom) return next
  return {
    ...next,
    memory: { ...memory, objectiveSummary: generatedSummary(next) },
  }
}

function syncSummary(data: AppData): AppData {
  return withMemory(data, data.memory)
}

function pushOutcome(memory: Memory, line: string): Memory {
  return { ...memory, outcomes: [line, ...memory.outcomes].slice(0, 24) }
}

function learnPreferences(memory: Memory, text: string): Memory {
  const additions: string[] = []
  if (/warm intro|warm introduction|warm path/i.test(text)) additions.push('Prefer a warm introduction')
  if (/no cold|don't cold|do not cold/i.test(text)) additions.push('Do not draft cold outreach')
  if (additions.length === 0) return memory
  const preferences = [...memory.preferences]
  for (const item of additions) {
    if (!preferences.includes(item)) preferences.push(item)
  }
  return { ...memory, preferences: preferences.slice(0, 24) }
}

function replaceOpportunity(data: AppData, opportunity: Opportunity): AppData {
  return {
    ...data,
    opportunities: data.opportunities.map((item) => (item.id === opportunity.id ? opportunity : item)),
  }
}

function touch(opportunity: Opportunity, patch: Partial<Opportunity>, label: string): Opportunity {
  return {
    ...opportunity,
    ...patch,
    updatedAt: now(),
    activity: [...opportunity.activity, act(label)],
  }
}

function makeObjective(title: string, kind: ObjectiveKind): Objective {
  return {
    id: uid('obj'),
    title,
    kind,
    status: 'active',
    context: '',
    timing: '',
    createdAt: now(),
  }
}

function makeOpportunity(
  person: DemoPerson,
  objective: Objective,
  stage: Opportunity['stage'],
): Opportunity {
  const proposed = stage === 'intro_proposed'
  const label = proposed
    ? `Qualified ${person.name} and drafted an intro via ${person.warmPath.mutual}.`
    : stage === 'qualified'
      ? `Qualified ${person.name}. Intro not proposed yet.`
      : `Researching ${person.name}. Not enough of a reason to propose an intro yet.`
  return {
    id: uid('opp'),
    personId: person.id,
    objectiveId: objective.id,
    stage,
    whyNow: person.whyNow,
    reasonYou: person.fitForYou,
    reasonThem: person.fitForThem,
    mutual: person.warmPath.mutual,
    relationship: person.warmPath.relationship,
    shared: person.warmPath.shared,
    draft: proposed ? draftIntro(person, objective) : '',
    followUpDraft: draftFollowUp(person, objective),
    investment: person.investment,
    createdAt: now(),
    updatedAt: now(),
    activity: [act('Researched the demo graph for this objective.'), act(label)],
  }
}

function qualify(data: AppData, objective: Objective): AppData {
  const { people, broadened } = matchPeople(objective)
  const opportunities = people.slice(0, qualifyLimit(objective.kind)).map((person, index) =>
    makeOpportunity(person, objective, stageForRank(index, person)),
  )
  const lead = people[0]
  if (!lead) {
    return {
      ...data,
      phase: 'active',
      messages: [
        ...data.messages,
        message(
          'agent',
          'I couldn’t qualify anyone from the demo graph for that objective. Try investors, lead generation, or resellers — or say it in your own words.',
        ),
      ],
    }
  }
  const leadOpp = opportunities[0]
  const search = buildSearch(objective)
  return syncSummary({
    ...data,
    phase: 'active',
    searches: [search, ...data.searches.filter((item) => item.objectiveId !== objective.id)],
    opportunities: [...opportunities, ...data.opportunities],
    messages: [
      ...data.messages,
      message(
        'agent',
        `${proposalPrompt(lead, broadened)} You can open a demo conversation with ${lead.name} from the card. That thread is fictional and is not emailed.`,
        { opportunityId: leadOpp.id },
      ),
    ],
  })
}

function phaseFor(objective: Objective): Phase {
  if (!objective.context) return 'awaiting_context'
  if (!objective.timing) return 'awaiting_timing'
  return 'active'
}

function activeObjective(data: AppData): Objective | undefined {
  return data.objectives.find((objective) => objective.id === data.activeObjectiveId)
}

export function freshState(): AppData {
  return {
    objectives: [],
    opportunities: [],
    searches: [],
    threads: [],
    messages: [{ id: 'msg-welcome', role: 'agent', text: WELCOME_TEXT, at: now() }],
    memory: {
      objectiveSummary: '',
      summaryCustom: false,
      preferences: [],
      outcomes: [],
    },
    phase: 'awaiting_objective',
    activeObjectiveId: null,
  }
}

function beginObjective(data: AppData, title: string, kind: ObjectiveKind): AppData {
  const objective = makeObjective(title, kind)
  return syncSummary({
    ...data,
    activeObjectiveId: objective.id,
    phase: 'awaiting_context',
    objectives: [objective, ...data.objectives],
    messages: [...data.messages, message('user', title), message('agent', contextPrompt(title, kind))],
  })
}

export function threadIdFor(opportunityId: string): string {
  return `thread-${opportunityId}`
}

export function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'hydrate':
      return action.data
    case 'reset':
      return freshState()
    case 'submit_objective':
    case 'create_objective': {
      if (validateObjectiveTitle(action.title)) return state
      const title = action.title.trim()
      const kind = action.type === 'submit_objective' ? (action.kind ?? inferKind(title)) : inferKind(title)
      return beginObjective(state, title, kind)
    }
    case 'submit_context': {
      if (validateDetail(action.text, 'context')) return state
      const objective = activeObjective(state)
      if (!objective || state.phase !== 'awaiting_context' || objective.status !== 'active') return state
      const text = action.text.trim()
      const updated: Objective = { ...objective, context: text }
      const next: AppData = {
        ...state,
        phase: 'awaiting_timing',
        objectives: state.objectives.map((item) => (item.id === updated.id ? updated : item)),
        messages: [...state.messages, message('user', text), message('agent', timingPrompt(updated.kind))],
        memory: learnPreferences(state.memory, text),
      }
      return syncSummary(next)
    }
    case 'submit_timing': {
      if (validateDetail(action.text, 'timing')) return state
      const objective = activeObjective(state)
      if (!objective || state.phase !== 'awaiting_timing' || objective.status !== 'active') return state
      const text = action.text.trim()
      const updated: Objective = { ...objective, timing: text }
      const next: AppData = {
        ...state,
        objectives: state.objectives.map((item) => (item.id === updated.id ? updated : item)),
        messages: [...state.messages, message('user', text)],
        memory: learnPreferences(state.memory, text),
      }
      return qualify(syncSummary(next), updated)
    }
    case 'send_note': {
      if (validateDetail(action.text, 'message')) return state
      return {
        ...state,
        messages: [...state.messages, message('user', action.text.trim()), message('agent', noteReply())],
      }
    }
    case 'start_new_objective':
      return {
        ...state,
        phase: 'awaiting_objective',
        messages: [...state.messages, message('agent', newObjectivePrompt())],
      }
    case 'select_objective': {
      const objective = state.objectives.find((item) => item.id === action.id)
      if (!objective) return state
      if (objective.status === 'paused') {
        return syncSummary({
          ...state,
          activeObjectiveId: objective.id,
          phase: 'active',
          messages: [...state.messages, message('agent', pausedPrompt(objective.title))],
        })
      }
      return syncSummary({
        ...state,
        activeObjectiveId: objective.id,
        phase: phaseFor(objective),
      })
    }
    case 'set_status': {
      const objective = state.objectives.find((item) => item.id === action.id)
      if (!objective || objective.status === action.status) return state
      const updated: Objective = { ...objective, status: action.status }
      const isCurrent = state.activeObjectiveId === objective.id
      let next: AppData = {
        ...state,
        objectives: state.objectives.map((item) => (item.id === updated.id ? updated : item)),
      }
      if (isCurrent && action.status === 'paused') {
        next = {
          ...next,
          phase: 'active',
          messages: [...next.messages, message('agent', pausedPrompt(updated.title))],
        }
      }
      if (isCurrent && action.status === 'active' && objective.status === 'paused') {
        next = {
          ...next,
          phase: phaseFor(updated),
          messages: [...next.messages, message('agent', resumedPrompt(updated.title))],
        }
      }
      if (action.status === 'done') {
        next = {
          ...next,
          phase: isCurrent ? 'active' : next.phase,
          memory: pushOutcome(next.memory, `Marked “${updated.title}” done.`),
          messages: isCurrent ? [...next.messages, message('agent', donePrompt(updated.title))] : next.messages,
        }
      }
      return syncSummary(next)
    }
    case 'approve_intro': {
      const opportunity = state.opportunities.find((item) => item.id === action.opportunityId)
      const person = opportunity ? getPerson(opportunity.personId) : undefined
      if (!opportunity || !person || opportunity.stage !== 'intro_proposed') return state
      const updated = touch(
        opportunity,
        { stage: 'approved' },
        'You approved the intro draft. Nothing was emailed.',
      )
      return syncSummary({
        ...replaceOpportunity(state, updated),
        memory: pushOutcome(
          state.memory,
          `Approved intro to ${person.name} via ${person.warmPath.mutual}. Not sent.`,
        ),
        messages: [...state.messages, message('agent', approvedPrompt(person), { followThroughId: updated.id })],
      })
    }
    case 'reject_intro': {
      const opportunity = state.opportunities.find((item) => item.id === action.opportunityId)
      const person = opportunity ? getPerson(opportunity.personId) : undefined
      if (!opportunity || !person || opportunity.stage !== 'intro_proposed') return state
      const rejected = touch(opportunity, { stage: 'nurture' }, `You passed on ${person.name}.`)
      let next = replaceOpportunity(state, rejected)
      const qualified = next.opportunities.find(
        (item) => item.objectiveId === opportunity.objectiveId && item.stage === 'qualified',
      )
      const researching = next.opportunities.find(
        (item) => item.objectiveId === opportunity.objectiveId && item.stage === 'researching',
      )
      const candidate = qualified ?? researching
      const candidatePerson = candidate ? getPerson(candidate.personId) : undefined
      const objective = next.objectives.find((item) => item.id === opportunity.objectiveId)
      let promoted: Opportunity | null = null
      if (candidate && candidatePerson && objective) {
        promoted = touch(
          { ...candidate, draft: candidate.draft || draftIntro(candidatePerson, objective) },
          { stage: 'intro_proposed' },
          `Drafted an intro to ${candidatePerson.name} after you passed on ${person.name}.`,
        )
        next = replaceOpportunity(next, promoted)
      }
      return syncSummary({
        ...next,
        memory: pushOutcome(next.memory, `Passed on ${person.name}.`),
        messages: [
          ...next.messages,
          message('agent', rejectedPrompt(person.name, candidatePerson ?? null, !qualified && Boolean(researching)), {
            opportunityId: promoted?.id,
          }),
        ],
      })
    }
    case 'edit_intro': {
      if (validateDetail(action.draft, 'draft')) return state
      const opportunity = state.opportunities.find((item) => item.id === action.opportunityId)
      if (!opportunity || opportunity.stage !== 'intro_proposed') return state
      const updated = touch(opportunity, { draft: action.draft.trim() }, 'You edited the intro draft.')
      return replaceOpportunity(state, updated)
    }
    case 'mark_introduced': {
      const opportunity = state.opportunities.find((item) => item.id === action.opportunityId)
      const person = opportunity ? getPerson(opportunity.personId) : undefined
      if (!opportunity || !person || opportunity.stage !== 'approved') return state
      const updated = touch(opportunity, { stage: 'introduced' }, `You marked the intro to ${person.name} as made.`)
      return syncSummary({
        ...replaceOpportunity(state, updated),
        memory: pushOutcome(state.memory, `Marked the introduction to ${person.name} as made.`),
        messages: [...state.messages, message('agent', introducedPrompt(person), { followThroughId: updated.id })],
      })
    }
    case 'log_follow_up': {
      const opportunity = state.opportunities.find((item) => item.id === action.opportunityId)
      const person = opportunity ? getPerson(opportunity.personId) : undefined
      if (!opportunity || !person || opportunity.stage !== 'introduced') return state
      const updated = touch(opportunity, { stage: 'following_up' }, `Follow-through logged for ${person.name}.`)
      return syncSummary({
        ...replaceOpportunity(state, updated),
        memory: pushOutcome(state.memory, `Follow-through logged for ${person.name}.`),
        messages: [...state.messages, message('agent', followLoggedPrompt(person))],
      })
    }
    case 'move_stage': {
      const opportunity = state.opportunities.find((item) => item.id === action.opportunityId)
      const person = opportunity ? getPerson(opportunity.personId) : undefined
      if (!opportunity || !person) return state
      const allowed: PipelineStage[] = ['approved', 'introduced', 'following_up']
      if (!allowed.includes(opportunity.stage)) return state
      const label =
        action.stage === 'closed'
          ? `You closed ${person.name}.`
          : `You moved ${person.name} to nurture.`
      const updated = touch(opportunity, { stage: action.stage }, label)
      return syncSummary({
        ...replaceOpportunity(state, updated),
        memory: pushOutcome(state.memory, label),
      })
    }
    case 'propose_intro': {
      const opportunity = state.opportunities.find((item) => item.id === action.opportunityId)
      const person = opportunity ? getPerson(opportunity.personId) : undefined
      const objective = opportunity
        ? state.objectives.find((item) => item.id === opportunity.objectiveId)
        : undefined
      if (!opportunity || !person || !objective) return state
      if (objective.status === 'paused') return state
      if (opportunity.stage !== 'qualified' && opportunity.stage !== 'researching') return state
      const updated = touch(
        { ...opportunity, draft: opportunity.draft || draftIntro(person, objective) },
        { stage: 'intro_proposed' },
        `You asked for an intro draft to ${person.name}.`,
      )
      const caution =
        opportunity.stage === 'researching'
          ? ' This one was still in research, so the reason to meet is thinner.'
          : ''
      return {
        ...replaceOpportunity(state, updated),
        messages: [
          ...state.messages,
          message(
            'agent',
            `Drafted an intro to ${person.name} via ${person.warmPath.mutual}.${caution} It still needs your approval, and nothing is emailed.`,
            { opportunityId: updated.id },
          ),
        ],
      }
    }
    case 'add_preference': {
      if (validateDetail(action.text, 'preference')) return state
      const text = action.text.trim()
      if (state.memory.preferences.includes(text)) return state
      return {
        ...state,
        memory: { ...state.memory, preferences: [...state.memory.preferences, text].slice(0, 24) },
      }
    }
    case 'remove_preference':
      return {
        ...state,
        memory: {
          ...state.memory,
          preferences: state.memory.preferences.filter((item) => item !== action.text),
        },
      }
    case 'add_outcome_note': {
      if (validateDetail(action.text, 'note')) return state
      return {
        ...state,
        memory: pushOutcome(state.memory, `Note: ${action.text.trim()}`),
      }
    }
    case 'set_summary': {
      const text = action.text.trim()
      if (text.length > 500) return state
      return { ...state, memory: { ...state.memory, objectiveSummary: text, summaryCustom: true } }
    }
    case 'use_generated_summary':
      return syncSummary({ ...state, memory: { ...state.memory, summaryCustom: false } })
    case 'open_thread': {
      const opportunity = state.opportunities.find((item) => item.id === action.opportunityId)
      const person = opportunity ? getPerson(opportunity.personId) : undefined
      if (!opportunity || !person) return state
      const id = threadIdFor(opportunity.id)
      if (state.threads.some((thread) => thread.id === id)) return state
      const objective = state.objectives.find((item) => item.id === opportunity.objectiveId)
      const thread: PersonThread = {
        id,
        personId: person.id,
        objectiveId: opportunity.objectiveId,
        opportunityId: opportunity.id,
        createdAt: now(),
        updatedAt: now(),
        messages: [{ id: uid('pm'), role: 'person', text: personOpening(person, objective), at: now() }],
      }
      return {
        ...state,
        threads: [thread, ...state.threads],
        memory: pushOutcome(state.memory, `Opened a demo conversation with ${person.name}. Not sent.`),
      }
    }
    case 'send_person_message': {
      if (validateDetail(action.text, 'message')) return state
      const thread = state.threads.find((item) => item.id === action.threadId)
      const person = thread ? getPerson(thread.personId) : undefined
      if (!thread || !person) return state
      const text = action.text.trim()
      const updated: PersonThread = {
        ...thread,
        updatedAt: now(),
        messages: [
          ...thread.messages,
          { id: uid('pm'), role: 'user', text, at: now() },
          { id: uid('pm'), role: 'person', text: personReply(person, text), at: now() },
        ],
      }
      return {
        ...state,
        threads: state.threads.map((item) => (item.id === thread.id ? updated : item)),
      }
    }
    default:
      return state
  }
}
