import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from './App'
import { STORAGE_KEY, WRITE_ERROR, normalizeData } from './lib/storage'
import { AppStateProvider } from './state/AppState'
import type { AppData } from './types'
import { freshState } from './state/reducer'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppStateProvider>
        <AppRoutes />
      </AppStateProvider>
    </MemoryRouter>,
  )
}

async function reachIntro(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /meet investors/i }))
  await user.type(
    screen.getByRole('textbox', { name: 'Message Connect' }),
    'Raising a seed round for infrastructure software',
  )
  await user.click(screen.getByRole('button', { name: 'Send' }))
  await user.type(screen.getByRole('textbox', { name: 'Message Connect' }), 'This quarter')
  await user.click(screen.getByRole('button', { name: 'Send' }))
}

describe('Arches Connect', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates an investor objective from the landing page', async () => {
    const user = userEvent.setup()
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/investors who should take the meeting/i)
    const hires = screen.getAllByRole('link', { name: 'Hire Connect' })
    await user.click(hires[0])
    expect(screen.getByRole('log')).toHaveTextContent(/what are you trying to achieve/i)
    expect(screen.getByRole('log')).toHaveTextContent(/investors are the place to start/i)
    expect(screen.getByRole('button', { name: /lead generation/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resellers/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /meet investors/i }))
    expect(screen.getByRole('log')).toHaveTextContent(/Meet investors is the objective/i)
    expect(screen.getByRole('log')).toHaveTextContent(/stage, the check size/i)
    await user.click(screen.getByRole('link', { name: 'Objectives' }))
    expect(screen.getByRole('heading', { name: 'Meet investors' })).toBeInTheDocument()
    expect(screen.getByText('Investors')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Active', pressed: true })).toBeInTheDocument()
  })

  it('rejects a blank or invalid objective', async () => {
    const user = userEvent.setup()
    renderAt('/app/chat')
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/objective/i)
    await user.type(screen.getByRole('textbox', { name: 'Message Connect' }), '??')
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/too thin/i)
    expect(screen.getByRole('log')).not.toHaveTextContent('??')
    expect(screen.getByRole('log')).not.toHaveTextContent(/is the objective/i)

    await user.click(screen.getByRole('link', { name: 'Objectives' }))
    await user.click(screen.getByRole('button', { name: 'Create objective' }))
    expect(screen.getByRole('alert')).toHaveTextContent(/objective/i)
    expect(screen.queryByRole('heading', { name: '??' })).not.toBeInTheDocument()
  })

  it('approves an investor intro, moves the pipeline, and shows the next move', async () => {
    const user = userEvent.setup()
    renderAt('/app/chat')
    await reachIntro(user)
    expect(screen.getByRole('button', { name: 'Approve intro' })).toBeInTheDocument()
    expect(screen.getByText('Maya Chen')).toBeInTheDocument()
    expect(screen.getAllByText(/\$1–3M/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Operator-led infrastructure and fintech/).length).toBeGreaterThan(0)
    expect(screen.getByRole('log')).toHaveTextContent(/Jordan Hale/)
    await user.click(screen.getByRole('button', { name: 'Approve intro' }))
    expect(screen.getByRole('log')).toHaveTextContent(/Next move:/)
    expect(screen.getByRole('log')).toHaveTextContent(/Nothing was emailed/)
    expect(screen.getByRole('button', { name: 'Mark introduced' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Pipeline' }))
    expect(screen.getByRole('heading', { name: 'Maya Chen' })).toBeInTheDocument()
    expect(screen.getByText(/Investor outreach is the primary path/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^Approved/ }))
    expect(screen.getByRole('heading', { name: 'Maya Chen' })).toBeInTheDocument()
    expect(screen.queryByText('Elias Okonkwo')).not.toBeInTheDocument()
    expect(screen.queryByText('Elena Brooks')).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Objectives' }))
    expect(screen.getByText(/You approved the intro draft. Nothing was emailed./)).toBeInTheDocument()
  })

  it('persists the objective and chat across a remount', async () => {
    const user = userEvent.setup()
    const first = renderAt('/app/chat')
    await user.click(screen.getByRole('button', { name: /meet investors/i }))
    expect(screen.getByRole('log')).toHaveTextContent(/Meet investors is the objective/i)
    first.unmount()

    renderAt('/app/objectives')
    expect(screen.getByRole('heading', { name: 'Meet investors' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Chat' }))
    expect(screen.getByRole('log')).toHaveTextContent(/Meet investors is the objective/i)
  })

  it('clears the saved preview from this browser', async () => {
    const user = userEvent.setup()
    renderAt('/app/chat')
    await user.click(screen.getByRole('button', { name: /meet investors/i }))
    await user.click(screen.getByRole('link', { name: 'Memory' }))
    await user.click(screen.getByRole('button', { name: 'Clear preview data' }))
    await user.click(screen.getByRole('button', { name: 'Confirm clear' }))
    await user.click(screen.getByRole('link', { name: 'Objectives' }))
    expect(screen.getByRole('heading', { name: 'No objectives yet' })).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY) ?? '').not.toContain('Meet investors')
  })

  it('shows a visible error when saving fails', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })
    renderAt('/app/chat')
    expect(await screen.findByRole('alert')).toHaveTextContent(WRITE_ERROR)
  })

  it('maps older objective kinds onto the investor-first set', () => {
    const base = freshState()
    const objective = (id: string, title: string, kind: string) => ({
      id,
      title,
      kind,
      status: 'active' as const,
      context: '',
      timing: '',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    const stored = {
      ...base,
      objectives: [objective('a', 'Raise', 'raise'), objective('b', 'Customers', 'customers'), objective('c', 'Partners', 'partners')],
    } as unknown as AppData
    const normalized = normalizeData(stored)
    expect(normalized.objectives.map((item) => item.kind)).toEqual(['investors', 'leads', 'resellers'])
  })
})
