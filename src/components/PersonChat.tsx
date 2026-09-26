import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { getPerson } from '../data/network'
import { validateDetail } from '../lib/validate'
import { useAppState } from '../state/AppState'
import { Avatar } from './Avatar'

export function PersonChat({ threadId }: { threadId: string }) {
  const { state, dispatch } = useAppState()
  const thread = state.threads.find((item) => item.id === threadId)
  const person = thread ? getPerson(thread.personId) : undefined
  const opportunity = thread ? state.opportunities.find((item) => item.id === thread.opportunityId) : undefined
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fit = opportunity?.investment ?? person?.investment

  useEffect(() => {
    const node = endRef.current
    if (!node || typeof node.scrollIntoView !== 'function') return
    try {
      node.scrollIntoView({ block: 'end' })
    } catch {
      // jsdom has no layout
    }
  }, [thread?.messages.length])

  useEffect(() => {
    inputRef.current?.focus()
  }, [threadId])

  if (!thread || !person) {
    return (
      <div className="chat-layout">
        <section className="chat-main">
          <div className="empty">
            <h1>That conversation isn’t in this workspace</h1>
            <p>Open a match from Connect’s chat to start a demo thread.</p>
            <Link className="btn btn-primary" to="/">
              Back to Connect
            </Link>
          </div>
        </section>
      </div>
    )
  }

  function submit(event?: FormEvent) {
    event?.preventDefault()
    const invalid = validateDetail(text, 'message')
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    setText('')
    dispatch({ type: 'send_person_message', threadId, text: text.trim() })
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div className="chat-layout">
      <section className="chat-main" aria-label={`Conversation with ${person.name}`}>
        <div className="chat-toolbar">
          <div className="thread-title">
            <Avatar name={person.name} id={person.id} />
            <div>
              <p className="agent-name">{person.name}</p>
              <p className="muted">
                {person.role} at {person.company} · Demo profile
              </p>
            </div>
          </div>
          <Link to="/" className="btn btn-secondary btn-small">
            Back to Connect
          </Link>
        </div>
        <p className="demo-banner">
          Demo conversation. {person.name} is fictional. Nothing is emailed to {person.name} or to {person.warmPath.mutual}.
          Warm path: {person.warmPath.mutual}, {person.warmPath.relationship}.
        </p>
        {fit ? (
          <dl className="fit-facts thread-facts">
            <div>
              <dt>Stage</dt>
              <dd>{fit.stage}</dd>
            </div>
            <div>
              <dt>Check size</dt>
              <dd>{fit.checkSize}</dd>
            </div>
            <div>
              <dt>Thesis</dt>
              <dd>{fit.thesis}</dd>
            </div>
            <div>
              <dt>Geography</dt>
              <dd>{fit.geography}</dd>
            </div>
          </dl>
        ) : null}
        <div className="transcript" role="log" aria-label={`Conversation with ${person.name}`}>
          {thread.messages.map((message) => (
            <article key={message.id} className={message.role === 'user' ? 'msg msg-user' : 'msg msg-agent'}>
              <p className="msg-kicker">{message.role === 'user' ? 'You' : `${person.name} · demo`}</p>
              <p className="prose">{message.text}</p>
            </article>
          ))}
          <div ref={endRef} />
        </div>
        <form className="composer" onSubmit={submit} aria-label={`Message ${person.name}`}>
          <label className="sr-only" htmlFor="person-composer">
            Message {person.name}
          </label>
          <textarea
            id="person-composer"
            ref={inputRef}
            rows={2}
            value={text}
            placeholder={`Reply to ${person.name} — demo only`}
            aria-label={`Message ${person.name}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'person-error' : 'person-hint'}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
          <p id="person-hint" className="hint">
            Demo replies stay in this workspace. They are not sent.
          </p>
          {error ? (
            <p id="person-error" className="form-error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  )
}
