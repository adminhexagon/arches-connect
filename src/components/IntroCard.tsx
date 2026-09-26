import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPerson } from '../data/network'
import { validateDetail } from '../lib/validate'
import { useAppState } from '../state/AppState'
import { threadIdFor } from '../state/reducer'
import type { Opportunity } from '../types'
import { STAGE_LABEL } from '../types'
import { Avatar } from './Avatar'

export function IntroCard({
  opportunity,
  mode,
}: {
  opportunity: Opportunity
  mode: 'chat' | 'pipeline' | 'sample'
}) {
  const { dispatch } = useAppState()
  const navigate = useNavigate()
  const person = getPerson(opportunity.personId)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(opportunity.draft)
  const [error, setError] = useState<string | null>(null)

  if (!person) {
    return <p className="muted">This person is no longer in the demo graph.</p>
  }

  const canDecide = mode !== 'sample' && opportunity.stage === 'intro_proposed'
  const showDraft = Boolean(opportunity.draft)

  function saveDraft() {
    const invalid = validateDetail(draft, 'draft')
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    dispatch({ type: 'edit_intro', opportunityId: opportunity.id, draft })
    setEditing(false)
  }

  return (
    <article className="intro-card" aria-label={`Intro for ${person.name}`}>
      <div className="intro-accent" aria-hidden="true" />
      <div className="intro-body">
        <header className="intro-head">
          <Avatar name={person.name} id={person.id} />
          <div>
            <p className="demo-pill">Demo profile</p>
            <h3>{person.name}</h3>
            <p className="muted">
              {person.role} at {person.company} · {person.location}
            </p>
          </div>
          {mode !== 'sample' ? <span className={`badge badge-${opportunity.stage}`}>{STAGE_LABEL[opportunity.stage]}</span> : null}
        </header>

        <p className="why-now">{opportunity.whyNow || person.whyNow}</p>

        {(opportunity.investment ?? person.investment) ? (
          <dl className="fit-facts">
            <div>
              <dt>Stage</dt>
              <dd>{(opportunity.investment ?? person.investment)?.stage}</dd>
            </div>
            <div>
              <dt>Check size</dt>
              <dd>{(opportunity.investment ?? person.investment)?.checkSize}</dd>
            </div>
            <div>
              <dt>Thesis</dt>
              <dd>{(opportunity.investment ?? person.investment)?.thesis}</dd>
            </div>
            <div>
              <dt>Geography</dt>
              <dd>{(opportunity.investment ?? person.investment)?.geography}</dd>
            </div>
          </dl>
        ) : null}

        <div className="reasons">
          <section>
            <h4>Why you should meet</h4>
            <p>{opportunity.reasonYou || person.fitForYou}</p>
          </section>
          <section>
            <h4>Why they should meet you</h4>
            <p>{opportunity.reasonThem || person.fitForThem}</p>
          </section>
        </div>

        <section className="warm-path">
          <h4>Warm path</h4>
          <p>
            <strong>{opportunity.mutual || person.warmPath.mutual}</strong>
            <span> · {opportunity.relationship || person.warmPath.relationship}</span>
          </p>
          <p>{opportunity.shared || person.warmPath.shared}</p>
        </section>

        {showDraft ? (
          <section className="draft-block">
            <div className="draft-label">
              <h4>Intro note</h4>
              <p>Simulated draft from the demo profile and your objective.</p>
            </div>
            {editing ? (
              <>
                <label className="sr-only" htmlFor={`draft-${opportunity.id}`}>
                  Edit intro draft
                </label>
                <textarea
                  id={`draft-${opportunity.id}`}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={8}
                />
                {error ? (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                ) : null}
                <div className="row-actions">
                  <button type="button" className="btn btn-primary btn-small" onClick={saveDraft}>
                    Save draft
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => {
                      setDraft(opportunity.draft)
                      setEditing(false)
                      setError(null)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <pre className="draft-text">{opportunity.draft}</pre>
            )}
          </section>
        ) : null}

        {mode !== 'sample' ? (
          <div className="row-actions">
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => {
                dispatch({ type: 'open_thread', opportunityId: opportunity.id })
                navigate(`/talk/${threadIdFor(opportunity.id)}`)
              }}
            >
              Talk with {person.name}
            </button>
          </div>
        ) : (
          <p className="card-caption">Sample only. Approval in the product records a decision and does not send email.</p>
        )}

        {canDecide && !editing ? (
          <>
            <p className="card-caption">Approving records your decision in this browser. It does not send email.</p>
            <div className="row-actions">
              <button
                type="button"
                className="btn btn-primary btn-small"
                onClick={() => dispatch({ type: 'approve_intro', opportunityId: opportunity.id })}
              >
                Approve intro
              </button>
              <button type="button" className="btn btn-secondary btn-small" onClick={() => setEditing(true)}>
                Edit intro
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => dispatch({ type: 'reject_intro', opportunityId: opportunity.id })}
              >
                Reject intro
              </button>
            </div>
          </>
        ) : null}

        {mode !== 'sample' && opportunity.stage === 'approved' ? (
          <p className="card-status">Approved — logged on this device. Nothing was emailed.</p>
        ) : null}
        {mode !== 'sample' && opportunity.stage === 'nurture' ? (
          <p className="card-status">Passed. Held in nurture.</p>
        ) : null}
      </div>
    </article>
  )
}
