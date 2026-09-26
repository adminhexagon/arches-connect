import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from 'react'
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
  const fresh = state.phase === 'awaiting_objective'

  useEffect(() => {
    const node = endRef.current
    if (!node || typeof node.scrollIntoView !== 'function') return
    try {
      node.scrollIntoView({ block: 'end' })
    } catch {
      // jsdom has no layout
    }
  }, [state.messages.length, fresh])

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

  const placeholder = fresh
    ? 'Ask Connect anything…'
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
        : 'Ask Connect anything…'

  return (
    <div className={fresh ? 'chat-layout chat-home' : 'chat-layout'}>
      <section className="chat-main" aria-label="Conversation">
        {fresh ? (
          <div className="home-center">
            <Logo size={56} />
            <div className="transcript home-log" role="log" aria-label="Conversation with Connect">
              <h1>What should Connect get done for you?</h1>
            </div>
            <Composer
              text={text}
              placeholder={placeholder}
              error={error}
              inputRef={inputRef}
              onChange={setText}
              onKeyDown={onKeyDown}
              onSubmit={onSubmit}
            />
            <div className="suggestion-row" role="group" aria-label="Suggested objectives">
              {OBJECTIVE_CHIPS.map((chip) => (
                <button
                  key={chip.kind}
                  type="button"
                  className={chip.primary ? 'suggest suggest-primary' : 'suggest'}
                  onClick={() => {
                    setError(null)
                    setText('')
                    dispatch({ type: 'submit_objective', title: chip.title, kind: chip.kind })
                  }}
                >
                  {chip.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
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
                    {message.role === 'agent' ? <p className="msg-kicker">Connect</p> : null}
                    <p className="prose">{message.text}</p>
                    {opportunity ? <IntroCard opportunity={opportunity} mode="chat" /> : null}
                    {follow ? <NextMove opportunity={follow} /> : null}
                  </article>
                )
              })}
              <div ref={endRef} />
            </div>
            <Composer
              text={text}
              placeholder={placeholder}
              error={error}
              inputRef={inputRef}
              onChange={setText}
              onKeyDown={onKeyDown}
              onSubmit={onSubmit}
            />
          </>
        )}
      </section>
    </div>
  )
}

function Composer({
  text,
  placeholder,
  error,
  inputRef,
  onChange,
  onKeyDown,
  onSubmit,
}: {
  text: string
  placeholder: string
  error: string | null
  inputRef: RefObject<HTMLTextAreaElement | null>
  onChange: (value: string) => void
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
  onSubmit: (event: FormEvent) => void
}) {
  return (
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
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <button type="submit" className="send-btn" aria-label="Send">
        <span aria-hidden="true">↑</span>
      </button>
      <p id="composer-hint" className="hint">
        Connect is a preview on this device. Demo people are fictional, and nothing is emailed.
      </p>
      {error ? (
        <p id="composer-error" className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
