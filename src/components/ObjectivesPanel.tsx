import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPerson } from '../data/network'
import { formatWhen } from '../lib/ids'
import { validateObjectiveTitle } from '../lib/validate'
import { useAppState } from '../state/AppState'
import { KIND_LABEL, type Objective } from '../types'

type Filter = 'all' | 'live' | 'closed'

function statusFor(objective: Objective): { label: string; tone: 'shape' | 'live' | 'closed' | 'paused' } {
  if (objective.status === 'done') return { label: 'Closed', tone: 'closed' }
  if (objective.status === 'paused') return { label: 'Paused', tone: 'paused' }
  if (!objective.context || !objective.timing) return { label: 'Being shaped', tone: 'shape' }
  return { label: 'Connect is on it', tone: 'live' }
}

export function ObjectivesPanel() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const liveCount = state.objectives.filter((objective) => objective.status !== 'done').length
  const closedCount = state.objectives.filter((objective) => objective.status === 'done').length
  const needle = query.trim().toLowerCase()
  const visible = state.objectives.filter((objective) => {
    if (filter === 'live' && objective.status === 'done') return false
    if (filter === 'closed' && objective.status !== 'done') return false
    if (!needle) return true
    const blob = `${objective.title} ${objective.context} ${KIND_LABEL[objective.kind]}`.toLowerCase()
    return blob.includes(needle)
  })

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
    navigate('/')
  }

  return (
    <div className="panel-scroll">
      <header className="page-head">
        <h1>Objectives</h1>
        <p>Everything you have asked Connect to achieve, and where each one stands.</p>
      </header>
      <div className="obj-toolbar">
        <label className="sr-only" htmlFor="objective-search">
          Search objectives
        </label>
        <input
          id="objective-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search objectives..."
        />
        <div className="seg" role="group" aria-label="Filter objectives">
          <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </button>
          <button type="button" aria-pressed={filter === 'live'} onClick={() => setFilter('live')}>
            Live {liveCount}
          </button>
          <button type="button" aria-pressed={filter === 'closed'} onClick={() => setFilter('closed')}>
            Closed {closedCount}
          </button>
        </div>
      </div>

      <form className="create-form" aria-label="Create objective" onSubmit={onCreate}>
        <label htmlFor="new-objective">New objective</label>
        <div className="create-row">
          <input
            id="new-objective"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="I'm looking for investors"
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
        <div className="empty-panel">
          <h2>No objectives yet</h2>
          <p>Tell Connect what you’re trying to achieve. Investor outreach is the primary path.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty-panel">
          <h2>No objectives in this view</h2>
          <p>Try another filter, or clear the search.</p>
        </div>
      ) : (
        <ul className="obj-list">
          {visible.map((objective) => {
            const status = statusFor(objective)
            const linked = state.opportunities.filter((opportunity) => opportunity.objectiveId === objective.id)
            const search = state.searches.find((item) => item.objectiveId === objective.id)
            return (
              <li key={objective.id} className="obj-row">
                <div>
                  <h2>{objective.title}</h2>
                  <p>
                    {KIND_LABEL[objective.kind]}
                    {search?.criteria ? ` · ${search.criteria}` : ''}
                    {linked.length ? ` · ${linked.length} in the pipeline` : ''}
                  </p>
                  {linked.some((opportunity) => opportunity.activity.some((item) => /approved/i.test(item.label))) ? (
                    <p className="activity-line">You approved the intro draft. Nothing was emailed.</p>
                  ) : null}
                  <ul className="activity-times">
                    {linked.flatMap((opportunity) => {
                      const person = getPerson(opportunity.personId)
                      return opportunity.activity.slice(-2).map((item) => (
                        <li key={item.id}>
                          {person?.name ? `${person.name}: ` : ''}
                          {item.label} <time dateTime={item.at}>{formatWhen(item.at)}</time>
                        </li>
                      ))
                    })}
                  </ul>
                </div>
                <div className="obj-side">
                  <span className={`status-chip tone-${status.tone}`}>{status.label}</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      dispatch({ type: 'select_objective', id: objective.id })
                      navigate('/')
                    }}
                  >
                    Work on this
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
