import { useState, type FormEvent } from 'react'
import { validateDetail } from '../lib/validate'
import { useAppState } from '../state/AppState'
import { KIND_LABEL } from '../types'

export function MemoriesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch, resetWorkspace } = useAppState()
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [armed, setArmed] = useState(false)
  const active = state.objectives.find((objective) => objective.id === state.activeObjectiveId) ?? state.objectives[0]
  const search = state.searches.find((item) => item.objectiveId === active?.id)
  const looking = active
    ? [active.title, KIND_LABEL[active.kind], search?.criteria].filter(Boolean).join(' · ')
    : ''

  if (!open) return null

  function tellConnect(event: FormEvent) {
    event.preventDefault()
    const invalid = validateDetail(text, 'note')
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    dispatch({ type: 'add_correction', text: text.trim() })
    setText('')
  }

  return (
    <div className="modal-layer">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="memories-title">
        <header className="modal-head">
          <div>
            <h2 id="memories-title">Memories</h2>
            <p>What Connect has learned about you.</p>
          </div>
          <button type="button" className="icon-btn" aria-label="Close memories" onClick={onClose}>
            ×
          </button>
        </header>
        <section>
          <h3>What you do</h3>
          <p>{active?.context || state.memory.objectiveSummary || 'Connect does not have this yet. Start an objective and add context.'}</p>
        </section>
        <section>
          <h3>What you are looking for</h3>
          <p>{looking || 'Investors are the default path until you name a different objective.'}</p>
        </section>
        <section>
          <h3>How you work with partners</h3>
          <p>
            {state.memory.preferences.length > 0
              ? state.memory.preferences.join(' ')
              : 'No partner preference is saved yet. Mention a warm intro while you give context, or correct this below.'}
          </p>
        </section>
        {state.memory.corrections.length > 0 ? (
          <section>
            <h3>Corrections</h3>
            <ul className="correction-list">
              {state.memory.corrections.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}
        <form onSubmit={tellConnect}>
          <label htmlFor="memory-correction">Something doesn’t look right?</label>
          <textarea
            id="memory-correction"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Say what we have wrong and Connect will take it from there."
            rows={3}
          />
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (!armed) {
                  setArmed(true)
                  return
                }
                resetWorkspace()
                setArmed(false)
                onClose()
              }}
            >
              {armed ? 'Confirm clear' : 'Clear preview data'}
            </button>
            <button type="submit" className="btn btn-primary">
              Tell Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
