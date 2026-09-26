import { getPerson } from '../data/network'
import { useAppState } from '../state/AppState'
import type { Opportunity } from '../types'

export function NextMove({ opportunity }: { opportunity: Opportunity }) {
  const { dispatch } = useAppState()
  const person = getPerson(opportunity.personId)
  if (!person) return null

  if (opportunity.stage === 'approved') {
    return (
      <section className="next-move" aria-label="Next move">
        <p className="eyebrow">
          <span className="dot" aria-hidden="true" /> Next move
        </p>
        <h3>Ask {opportunity.mutual} for the intro</h3>
        <p>
          When you treat the introduction as made, log it here. Connect will not email {opportunity.mutual}.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-small"
          onClick={() => dispatch({ type: 'mark_introduced', opportunityId: opportunity.id })}
        >
          Mark introduced
        </button>
      </section>
    )
  }

  if (opportunity.stage === 'introduced') {
    return (
      <section className="next-move" aria-label="Follow-through">
        <p className="eyebrow">
          <span className="dot" aria-hidden="true" /> Follow-through
        </p>
        <h3>Check in with {person.name.split(' ')[0]}</h3>
        <pre className="draft-text">{opportunity.followUpDraft}</pre>
        <div className="row-actions">
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={() => dispatch({ type: 'log_follow_up', opportunityId: opportunity.id })}
          >
            Log follow-up
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => dispatch({ type: 'move_stage', opportunityId: opportunity.id, stage: 'nurture' })}
          >
            Move to nurture
          </button>
        </div>
      </section>
    )
  }

  if (opportunity.stage === 'following_up') {
    return (
      <section className="next-move" aria-label="Resolve opportunity">
        <p className="eyebrow">
          <span className="dot" aria-hidden="true" /> Still open
        </p>
        <h3>{person.name} is in follow-through</h3>
        <p>Close this when the conversation has done its job, or keep it warm in nurture.</p>
        <div className="row-actions">
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={() => dispatch({ type: 'move_stage', opportunityId: opportunity.id, stage: 'closed' })}
          >
            Close opportunity
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => dispatch({ type: 'move_stage', opportunityId: opportunity.id, stage: 'nurture' })}
          >
            Move to nurture
          </button>
        </div>
      </section>
    )
  }

  return null
}
