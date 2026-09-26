import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getPerson } from '../data/network'
import { useAppState } from '../state/AppState'
import { Logo } from './Logo'
import { MemoriesDialog } from './MemoriesDialog'
import { StorageBanner } from './StorageBanner'

const NAV = [
  { to: '/', label: 'New chat', end: true },
  { to: '/history', label: 'Chat History', end: false },
  { to: '/objectives', label: 'Objectives', end: false },
  { to: '/pipeline', label: 'Pipeline', end: false },
  { to: '/connectors', label: 'Connectors', end: false },
  { to: '/billing', label: 'Billing', end: false },
  { to: '/referrals', label: 'Referrals', end: false },
]

export function Workspace() {
  const { state, ready, dispatch } = useAppState()
  const navigate = useNavigate()
  const location = useLocation()
  const [pinnedOpen, setPinnedOpen] = useState(true)
  const [recentOpen, setRecentOpen] = useState(true)
  const [memoriesOpen, setMemoriesOpen] = useState(false)
  const active = state.objectives.find((objective) => objective.id === state.activeObjectiveId)
  const talkId = location.pathname.startsWith('/talk/') ? location.pathname.split('/').pop() : ''
  const talk = state.threads.find((thread) => thread.id === talkId)
  const talkPerson = talk ? getPerson(talk.personId) : undefined

  const recent = [
    ...state.objectives.map((objective) => ({
      key: `objective:${objective.id}`,
      title: objective.title,
      detail: state.searches.find((item) => item.objectiveId === objective.id)?.criteria || 'Objective',
      at: objective.createdAt,
      href: '',
      open: () => {
        dispatch({ type: 'select_objective', id: objective.id })
        navigate('/')
      },
    })),
    ...state.threads.map((thread) => ({
      key: `thread:${thread.id}`,
      title: getPerson(thread.personId)?.name ?? 'Demo profile',
      detail: 'Demo conversation',
      at: thread.updatedAt,
      href: `/talk/${thread.id}`,
      open: () => navigate(`/talk/${thread.id}`),
    })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1))
  const pins = state.pinnedIds ?? []
  const pinned = recent.filter((item) => pins.includes(item.key))
  const unpinned = recent.filter((item) => !pins.includes(item.key))

  const crumb = talkPerson
    ? talkPerson.name
    : location.pathname === '/history'
      ? 'Chat History'
      : location.pathname === '/objectives'
        ? 'Objectives'
        : location.pathname === '/pipeline'
          ? 'Pipeline'
          : location.pathname === '/connectors'
            ? 'Connectors'
            : location.pathname === '/billing'
              ? 'Billing'
              : location.pathname === '/referrals'
                ? 'Referrals'
                : state.phase === 'awaiting_objective'
                  ? 'New chat'
                  : active?.title || 'Chat with Connect'

  if (!ready) {
    return (
      <div className="app-shell">
        <p className="boot" role="status">
          Opening your workspace
        </p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <StorageBanner />
      <div className="app-body">
        <aside className="sidebar" aria-label="Workspace">
          <NavLink to="/" className="side-brand" end>
            <Logo size={28} />
            <span>Connect</span>
          </NavLink>
          <nav className="side-nav" aria-label="Workspace pages">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
                onClick={() => {
                  if (item.to === '/' && state.phase !== 'awaiting_objective') {
                    dispatch({ type: 'start_new_objective' })
                  }
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <section className="side-fold">
            <button type="button" className="fold-label" aria-expanded={pinnedOpen} onClick={() => setPinnedOpen((open) => !open)}>
              Pinned
            </button>
            {pinnedOpen ? (
              pinned.length === 0 ? (
                <p className="side-empty">Pin a chat to keep it here.</p>
              ) : (
                <ul className="recent-list">
                  {pinned.map((item) => (
                    <RecentRow key={item.key} item={item} pinned dispatch={dispatch} />
                  ))}
                </ul>
              )
            ) : null}
          </section>

          <section className="side-fold">
            <button type="button" className="fold-label" aria-expanded={recentOpen} onClick={() => setRecentOpen((open) => !open)}>
              Recent
            </button>
            {recentOpen ? (
              unpinned.length === 0 ? (
                <p className="side-empty">Recent chats show up here.</p>
              ) : (
                <ul className="recent-list">
                  {unpinned.map((item) => (
                    <RecentRow key={item.key} item={item} pinned={false} dispatch={dispatch} />
                  ))}
                </ul>
              )
            ) : null}
          </section>

          <footer className="user-footer">
            <span className="user-avatar" aria-hidden="true">
              L
            </span>
            <span>
              <strong>Local preview</strong>
              <small>Saved on this device</small>
            </span>
          </footer>
        </aside>

        <div className="stage" id="main">
          <div className="inbox-banner">
            <p>Give Connect a mailbox so the next intro can start from context you already have.</p>
            <NavLink to="/connectors" className="btn btn-light">
              Connect Gmail
            </NavLink>
          </div>
          <header className="topbar">
            <p className="crumbs">
              <NavLink to="/" aria-label="Home">
                Home
              </NavLink>
              <span aria-hidden="true">/</span>
              <span>Chat with Connect</span>
              <span aria-hidden="true">/</span>
              <strong>{crumb}</strong>
            </p>
            <div className="top-actions">
              <button type="button" className="text-action" onClick={() => setMemoriesOpen(true)}>
                Memories
              </button>
              <span className="preview-pill">Preview</span>
            </div>
          </header>
          <div className="stage-body">
            <Outlet />
            <MemoriesDialog open={memoriesOpen} onClose={() => setMemoriesOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}

function RecentRow({
  item,
  pinned,
  dispatch,
}: {
  item: { key: string; title: string; detail: string; href: string; open: () => void }
  pinned: boolean
  dispatch: (action: { type: 'toggle_pin'; id: string }) => void
}) {
  return (
    <li>
      {item.href ? (
        <NavLink to={item.href} className="recent-link">
          <span>{item.title}</span>
          <small>{item.detail}</small>
        </NavLink>
      ) : (
        <button type="button" className="recent-link" aria-label={`Open ${item.title}`} onClick={item.open}>
          <span>{item.title}</span>
          <small>{item.detail}</small>
        </button>
      )}
      <button
        type="button"
        className="pin-btn"
        aria-pressed={pinned}
        aria-label={pinned ? `Unpin ${item.title}` : `Pin ${item.title}`}
        onClick={() => dispatch({ type: 'toggle_pin', id: item.key })}
      >
        {pinned ? 'Unpin' : 'Pin'}
      </button>
    </li>
  )
}
