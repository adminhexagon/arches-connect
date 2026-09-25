import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPerson } from '../data/network'
import { formatWhen } from '../lib/ids'
import { validateObjectiveTitle } from '../lib/validate'
import { useAppState } from '../state/AppState'
import { KIND_LABEL, STATUS_LABEL, type ObjectiveStatus } from '../types'

const STATUSES: ObjectiveStatus[] = ['active', 'paused', 'done']

export function ObjectivesPanel() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  function onCreate(event: FormEvent) {
    event.preventDefault()
    const invalid = validateObjectiveTitle(title)
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    dispatch({ type: 'create_objective', title: title.trim() })
    setTitle('')
  }

  return (
    <div className="panel-scroll">
      <header className="panel-head">
        <div>
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" /> Objectives
          </p>
          <h1>What Connect is working</h1>
          <p className="lede-sm">Each objective keeps its people, drafts, and decisions. Pause one without losing the thread.</p>
        </div>
      </header>

      <form className="create-form" aria-label="Create objective" onSubmit={onCreate}>
        <label htmlFor="new-objective">New objective</label>
        <div className="create-row">
          <input
            id="new-objective"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Find a design partner for the climate API"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'objective-error' : undefined}
          />
          <button type="submit" className="btn btn-primary">
            Create objective
          </button>
        </div>
        {error ? (
          <p id="objective-error" className="form-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      {state.objectives.length === 0 ? (
        <div className="empty">
          <h2>No objectives yet</h2>
          <p>Tell Connect what you’re trying to achieve and it will qualify someone from the demo graph.</p>
          <Link className="btn btn-primary" to="/app/chat">
            Start chat
          </Link>
        </div>
      ) : (
        <ul className="obj-list">
          {state.objectives.map((objective) => {
            const linked = state.opportunities.filter((opportunity) => opportunity.objectiveId === objective.id)
            return (
              <li key={objective.id} className="obj-card">
                <div className="obj-top">
                  <div>
                    <p className="kind-line">{KIND_LABEL[objective.kind]}</p>
                    <h2>{objective.title}</h2>
                    <p className="muted">
                      {objective.context || 'Waiting for context.'}
                      {objective.timing ? ` · ${objective.timing}` : ''}
                    </p>
                  </div>
                  <div className="status-toggle" role="group" aria-label={`Status for ${objective.title}`}>
                    {STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        aria-pressed={objective.status === status}
                        onClick={() => dispatch({ type: 'set_status', id: objective.id, status })}
                      >
                        {STATUS_LABEL[status]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="obj-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => {
                      dispatch({ type: 'select_objective', id: objective.id })
                      navigate('/app/chat')
                    }}
                  >
                    Work in chat
                  </button>
                  <Link className="text-link" to="/app/pipeline">
                    {linked.length} in pipeline
                  </Link>
                </div>
                <div className="activity">
                  <h3>Linked activity</h3>
                  {linked.length === 0 ? (
                    <p className="muted">Nothing qualified yet. Finish the short interview in chat.</p>
                  ) : (
                    linked.map((opportunity) => {
                      const person = getPerson(opportunity.personId)
                      return (
                        <section key={opportunity.id}>
                          <h4>{person?.name ?? 'Unknown person'}</h4>
                          <ul>
                            {opportunity.activity.map((item) => (
                              <li key={item.id}>
                                <span>{item.label}</span>
                                <time dateTime={item.at}>{formatWhen(item.at)}</time>
                              </li>
                            ))}
                          </ul>
                        </section>
                      )
                    })
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
