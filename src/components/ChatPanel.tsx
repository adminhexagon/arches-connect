import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { OBJECTIVE_CHIPS } from '../lib/kind'
import { validateDetail, validateObjectiveTitle } from '../lib/validate'
import { useAppState } from '../state/AppState'
import { IntroCard } from './IntroCard'
import { Logo } from './Logo'
import { NextMove } from './NextMove'

export function ChatPanel() {
  const { state, dispatch } = useAppState()
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const active = state.objectives.find((objective) => objective.id === state.activeObjectiveId)

  useEffect(() => {
    const node = endRef.current
    if (!node || typeof node.scrollIntoView !== 'function') return
    try {
      node.scrollIntoView({ block: 'end' })
    } catch {
      // jsdom has no layout
    }
  }, [state.messages.length])

  useEffect(() => {
    inputRef.current?.focus()
  }, [state.phase])

  function submitText(value: string) {
    if (state.phase === 'awaiting_objective') {
      const invalid = validateObjectiveTitle(value)
      if (invalid) {
        setError(invalid)
        return
      }
      setError(null)
      setText('')
      dispatch({ type: 'submit_objective', title: value.trim() })
      return
    }
    if (state.phase === 'awaiting_context') {
      const invalid = validateDetail(value, 'context')
      if (invalid) {
        setError(invalid)
        return
      }
      setError(null)
      setText('')
      dispatch({ type: 'submit_context', text: value.trim() })
      return
    }
    if (state.phase === 'awaiting_timing') {
      const invalid = validateDetail(value, 'timing')
      if (invalid) {
        setError(invalid)
        return
      }
      setError(null)
      setText('')
      dispatch({ type: 'submit_timing', text: value.trim() })
      return
    }
    const invalid = validateDetail(value, 'message')
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    setText('')
    dispatch({ type: 'send_note', text: value.trim() })
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    submitText(text)
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitText(text)
    }
  }

  const placeholder =
    state.phase === 'awaiting_objective'
      ? 'Meet investors, or describe the raise'
      : state.phase === 'awaiting_context'
        ? active?.kind === 'leads'
          ? 'The buyer, and the pain that is current'
          : active?.kind === 'resellers'
            ? 'What a reseller would carry'
            : active?.kind === 'custom'
              ? 'What you offer, and who should care'
              : 'Stage, check size, thesis, and geography'
        : state.phase === 'awaiting_timing'
          ? active?.kind === 'investors'
            ? 'This month, this quarter, or when the story is tighter'
            : 'When this needs to move'
          : 'Ask for another pass, or start a new objective'

  return (
    <div className="chat-layout">
      <section className="chat-main" aria-label="Conversation">
        <div className="chat-toolbar">
          <div>
            <p className="agent-name">
              <Logo size={22} /> Connect
            </p>
            <p className="muted">Investor outreach first · demo workspace</p>
          </div>
          {state.phase !== 'awaiting_objective' ? (
            <button type="button" className="btn btn-secondary btn-small" onClick={() => dispatch({ type: 'start_new_objective' })}>
              New objective
            </button>
          ) : null}
        </div>

        <div className="transcript" role="log" aria-label="Conversation with Connect">
          {state.messages.map((message) => {
            const opportunity = message.opportunityId
              ? state.opportunities.find((item) => item.id === message.opportunityId)
              : undefined
            const follow = message.followThroughId
              ? state.opportunities.find((item) => item.id === message.followThroughId)
              : undefined
            return (
              <article key={message.id} className={message.role === 'user' ? 'msg msg-user' : 'msg msg-agent'}>
                {message.role === 'agent' ? <p className="msg-kicker">Connect</p> : <p className="msg-kicker">You</p>}
                <p className="prose">{message.text}</p>
                {opportunity ? <IntroCard opportunity={opportunity} mode="chat" /> : null}
                {follow ? <NextMove opportunity={follow} /> : null}
              </article>
            )
          })}

          {state.phase === 'awaiting_objective' ? (
            <div className="chips" role="group" aria-label="Suggested objectives">
              {OBJECTIVE_CHIPS.map((chip) => (
                <button
                  key={chip.kind}
                  type="button"
                  className={chip.primary ? 'chip chip-primary' : 'chip'}
                  onClick={() => {
                    setError(null)
                    setText('')
                    dispatch({ type: 'submit_objective', title: chip.title, kind: chip.kind })
                  }}
                >
                  {chip.primary ? <em className="chip-kicker">Primary</em> : null}
                  <span>{chip.title}</span>
                  <small>{chip.hint}</small>
                </button>
              ))}
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <form className="composer" onSubmit={onSubmit} aria-label="Send a message">
          <label className="sr-only" htmlFor="composer">
            Message Connect
          </label>
          <textarea
            id="composer"
            ref={inputRef}
            rows={2}
            value={text}
            placeholder={placeholder}
            aria-label="Message Connect"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'composer-error' : 'composer-hint'}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
          <p id="composer-hint" className="hint">
            Enter to send · Shift+Enter for a new line · Approval never sends email
          </p>
          {error ? (
            <p id="composer-error" className="form-error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  )
}
