import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { DEMO_NOTICE, getPerson } from '../data/network'
import { useAppState } from '../state/AppState'
import { KIND_LABEL } from '../types'
import { Logo } from './Logo'
import { StorageBanner } from './StorageBanner'

const LINKS = [
  { to: '/objectives', label: 'Objectives' },
  { to: '/pipeline', label: 'Pipeline' },
  { to: '/memory', label: 'Memory' },
]

export function Workspace() {
  const { state, ready, dispatch } = useAppState()
  const navigate = useNavigate()
  const location = useLocation()
  const showRail = location.pathname === '/' || location.pathname.startsWith('/talk/')
  const active = state.objectives.find((objective) => objective.id === state.activeObjectiveId)
  const search = state.searches.find((item) => item.objectiveId === active?.id)
  const matches = state.opportunities.filter((opportunity) => opportunity.objectiveId === active?.id)
  const lead = matches[0]
  const leadPerson = lead ? getPerson(lead.personId) : undefined
  const inProgress = state.objectives.filter((objective) => !state.searches.some((item) => item.objectiveId === objective.id))

  function hireConnect() {
    if (state.phase === 'awaiting_objective') {
      dispatch({ type: 'submit_objective', title: 'Meet investors', kind: 'investors' })
    } else {
      dispatch({ type: 'start_new_objective' })
    }
    navigate('/')
  }

  function openObjective(id: string) {
    dispatch({ type: 'select_objective', id })
    navigate('/')
  }

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
          <div className="side-brand">
            <Logo size={26} />
            <div>
              <strong>Arches Connect</strong>
              <span>Investor outreach</span>
            </div>
          </div>
          <button type="button" className="btn btn-primary side-hire" onClick={hireConnect}>
            Hire Connect
          </button>

          <nav className="side-nav" aria-label="Conversations">
            <p className="side-label">Conversations</p>
            <NavLink to="/" end className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
              <span>Connect</span>
              <small>Agent</small>
            </NavLink>
            {state.threads.map((thread) => {
              const person = getPerson(thread.personId)
              return (
                <NavLink
                  key={thread.id}
                  to={`/talk/${thread.id}`}
                  className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
                >
                  <span>{person?.name ?? 'Demo profile'}</span>
                  <small>Demo thread</small>
                </NavLink>
              )
            })}
          </nav>

          <nav className="side-nav" aria-label="Past searches">
            <p className="side-label">Past searches</p>
            {state.searches.length === 0 ? (
              <p className="side-empty">Searches you finish stay in this workspace.</p>
            ) : (
              state.searches.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="side-link side-button"
                  aria-label={`Saved search ${item.title}`}
                  aria-current={item.objectiveId === state.activeObjectiveId ? 'true' : undefined}
                  onClick={() => openObjective(item.objectiveId)}
                >
                  <span>{item.title}</span>
                  <small>{item.criteria || KIND_LABEL[item.kind]}</small>
                </button>
              ))
            )}
          </nav>

          {inProgress.length > 0 ? (
            <nav className="side-nav" aria-label="In progress">
              <p className="side-label">In progress</p>
              {inProgress.map((objective) => (
                <button
                  key={objective.id}
                  type="button"
                  className="side-link side-button"
                  aria-label={`In progress ${objective.title}`}
                  aria-current={objective.id === state.activeObjectiveId ? 'true' : undefined}
                  onClick={() => openObjective(objective.id)}
                >
                  <span>{objective.title}</span>
                  <small>{KIND_LABEL[objective.kind]}</small>
                </button>
              ))}
            </nav>
          ) : null}

          <nav className="side-nav side-links" aria-label="Workspace pages">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
          <p className="side-foot">
            {state.searches.length} saved {state.searches.length === 1 ? 'search' : 'searches'} on this device. {DEMO_NOTICE}
          </p>
        </aside>

        <div className="app-main" id="main">
          <Outlet />
        </div>

        {showRail ? (
          <aside className="context-rail" aria-label="Working context">
            <p className="eyebrow">
              <span className="dot" aria-hidden="true" /> This objective
            </p>
            {active ? (
              <>
                <h2>{active.title}</h2>
                <p className="kind-line">
                  {KIND_LABEL[active.kind]} · {active.status}
                </p>
                {search ? (
                  <section className="rail-block">
                    <h3>Saved search</h3>
                    <p>{search.criteria}</p>
                    <ul className="rail-criteria">
                      {search.stage ? <li>Stage {search.stage}</li> : null}
                      {search.checkSize ? <li>Check {search.checkSize}</li> : null}
                      {search.geography ? <li>Geography {search.geography}</li> : null}
                    </ul>
                  </section>
                ) : (
                  <p className="muted">{active.context || 'Context is saved as you answer.'}</p>
                )}
                {lead && leadPerson ? (
                  <section className="rail-block">
                    <h3>Top match</h3>
                    <p className="rail-name">{leadPerson.name}</p>
                    <p className="muted">
                      {leadPerson.role} at {leadPerson.company}
                    </p>
                    <p className="muted">Warm path: {lead.mutual}</p>
                    {(lead.investment ?? leadPerson.investment) ? (
                      <p className="muted">
                        {(lead.investment ?? leadPerson.investment)?.stage} · {(lead.investment ?? leadPerson.investment)?.checkSize}
                      </p>
                    ) : null}
                  </section>
                ) : null}
                <p className="count-line">{matches.length} in the pipeline</p>
              </>
            ) : (
              <>
                <h2>No objective yet</h2>
                <p className="muted">Hire Connect to start with investors, or pick lead generation or resellers in the chat.</p>
              </>
            )}
            <p className="demo-note">{DEMO_NOTICE}</p>
          </aside>
        ) : null}
      </div>
    </div>
  )
}
