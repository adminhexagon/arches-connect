import { useNavigate } from 'react-router-dom'
import { getPerson } from '../data/network'
import { formatWhen } from '../lib/ids'
import { useAppState } from '../state/AppState'
import { KIND_LABEL } from '../types'

export function HistoryPanel() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  const chats = [
    ...state.objectives.map((objective) => ({
      id: objective.id,
      title: objective.title,
      detail: [KIND_LABEL[objective.kind], objective.context].filter(Boolean).join(' · '),
      at: objective.createdAt,
      open: () => {
        dispatch({ type: 'select_objective', id: objective.id })
        navigate('/')
      },
    })),
    ...state.threads.map((thread) => {
      const person = getPerson(thread.personId)
      return {
        id: thread.id,
        title: person?.name ?? 'Demo profile',
        detail: 'Demo conversation',
        at: thread.updatedAt,
        open: () => navigate(`/talk/${thread.id}`),
      }
    }),
  ].sort((a, b) => (a.at < b.at ? 1 : -1))

  return (
    <div className="panel-scroll">
      <header className="page-head">
        <h1>Chat History</h1>
        <p>Conversations with Connect, and demo threads with matched people, stay on this device.</p>
      </header>
      {chats.length === 0 ? (
        <div className="empty-panel">
          <h2>No chats yet</h2>
          <p>Start with investors, clients, or reseller partners. The thread is kept after you reload.</p>
        </div>
      ) : (
        <ul className="history-list">
          {chats.map((chat) => (
            <li key={chat.id}>
              <h2>
                <button type="button" onClick={chat.open}>
                  {chat.title}
                </button>
              </h2>
              <span>{chat.detail}</span>
              <time dateTime={chat.at}>{formatWhen(chat.at)}</time>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
