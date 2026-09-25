import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from './Logo'
import { StorageBanner } from './StorageBanner'

const TABS = [
  { to: '/app/chat', label: 'Chat' },
  { to: '/app/objectives', label: 'Objectives' },
  { to: '/app/pipeline', label: 'Pipeline' },
  { to: '/app/memory', label: 'Memory' },
]

export function Workspace() {
  return (
    <div className="workspace">
      <StorageBanner />
      <header className="app-header">
        <NavLink to="/" className="brand">
          <Logo />
          <span>Arches Connect</span>
        </NavLink>
        <nav className="tabs" aria-label="Workspace">
          {TABS.map((tab) => (
            <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main">
        <Outlet />
      </main>
    </div>
  )
}
