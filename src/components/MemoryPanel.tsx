import { useState, type FormEvent } from 'react'
import { formatWhen } from '../lib/ids'
import { validateDetail } from '../lib/validate'
import { useAppState } from '../state/AppState'
import { summarize } from '../state/reducer'

export function MemoryPanel() {
  const { state, dispatch, resetWorkspace } = useAppState()
  const [preference, setPreference] = useState('')
  const [note, setNote] = useState('')
  const [summary, setSummary] = useState(state.memory.objectiveSummary)
  const [error, setError] = useState<string | null>(null)
  const [armed, setArmed] = useState(false)

  function saveSummary(event: FormEvent) {
    event.preventDefault()
    if (summary.trim().length > 500) {
      setError('Keep the summary under 500 characters.')
      return
    }
    setError(null)
    dispatch({ type: 'set_summary', text: summary })
  }

  function addPreference(event: FormEvent) {
    event.preventDefault()
    const invalid = validateDetail(preference, 'preference')
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    dispatch({ type: 'add_preference', text: preference.trim() })
    setPreference('')
  }

  function addNote(event: FormEvent) {
    event.preventDefault()
    const invalid = validateDetail(note, 'note')
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    dispatch({ type: 'add_outcome_note', text: note.trim() })
    setNote('')
  }

  return (
    <div className="panel-scroll memory-grid">
      <header className="panel-head">
        <div>
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" /> Memory
          </p>
          <h1>What should stick</h1>
          <p className="lede-sm">
            A short record of the objective, your preferences, and what already happened. Stored in this browser only.
          </p>
        </div>
      </header>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <section className="memory-card">
        <h2>Objective summary</h2>
        <form onSubmit={saveSummary}>
          <label className="sr-only" htmlFor="summary">
            Objective summary
          </label>
          <textarea
            id="summary"
            rows={4}
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
          />
          <div className="row-actions">
            <button type="submit" className="btn btn-primary btn-small">
              Save summary
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => {
                dispatch({ type: 'use_generated_summary' })
                const active = state.objectives.find((objective) => objective.id === state.activeObjectiveId)
                setSummary(active ? summarize(active) : '')
                setError(null)
              }}
            >
              Use generated summary
            </button>
          </div>
          {state.memory.summaryCustom ? <p className="muted">You’re using your own summary.</p> : <p className="muted">This follows the active objective until you edit it.</p>}
        </form>
      </section>

      <section className="memory-card">
        <h2>Preferences</h2>
        {state.memory.preferences.length === 0 ? (
          <p className="muted">None yet. Add one, or mention a warm intro while you give context.</p>
        ) : (
          <ul className="pref-list">
            {state.memory.preferences.map((item) => (
              <li key={item}>
                <span>{item}</span>
                <button type="button" aria-label={`Remove preference ${item}`} onClick={() => dispatch({ type: 'remove_preference', text: item })}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={addPreference} className="inline-form">
          <label htmlFor="preference">Add a preference</label>
          <div className="create-row">
            <input
              id="preference"
              value={preference}
              onChange={(event) => setPreference(event.target.value)}
              placeholder="Prefer operators over investors"
            />
            <button type="submit" className="btn btn-secondary">
              Add
            </button>
          </div>
        </form>
      </section>

      <section className="memory-card">
        <h2>Last outcomes</h2>
        {state.memory.outcomes.length === 0 ? (
          <p className="muted">Outcomes show up when you approve, pass, or follow through.</p>
        ) : (
          <ol className="outcome-list">
            {state.memory.outcomes.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ol>
        )}
        <form onSubmit={addNote} className="inline-form">
          <label htmlFor="outcome-note">Add a note</label>
          <div className="create-row">
            <input
              id="outcome-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="A fact you want remembered"
            />
            <button type="submit" className="btn btn-secondary">
              Save note
            </button>
          </div>
        </form>
      </section>

      <section className="memory-card danger-zone">
        <h2>This browser</h2>
        <p className="muted">
          Searches, chats, matches, and demo threads are saved in this browser. Clearing removes them from this device. Last activity{' '}
          {state.messages.at(-1) ? formatWhen(state.messages.at(-1)!.at) : 'just now'}.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            if (!armed) {
              setArmed(true)
              return
            }
            resetWorkspace()
            setSummary('')
            setArmed(false)
          }}
        >
          {armed ? 'Confirm clear' : 'Clear preview data'}
        </button>
      </section>
    </div>
  )
}
