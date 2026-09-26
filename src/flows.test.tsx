import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from './App'
import * as storage from './lib/storage'
import { WRITE_ERROR, normalizeData } from './lib/storage'
import { AppStateProvider } from './state/AppState'
import { freshState } from './state/reducer'
import type { AppData } from './types'

async function renderAt(path: string) {
  const view = render(
    <MemoryRouter initialEntries={[path]}>
      <AppStateProvider>
        <AppRoutes />
      </AppStateProvider>
    </MemoryRouter>,
  )
  await screen.findByRole('button', { name: 'Hire Connect' })
  return view
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
  await screen.findByRole('button', { name: 'Talk with Maya Chen' })
}

describe('Arches Connect', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens in the workspace and starts investor outreach with Hire Connect', async () => {
    const user = userEvent.setup()
    await renderAt('/')
    expect(screen.queryByRole('heading', { name: /investors who should take the meeting/i })).not.toBeInTheDocument()
    expect(screen.getByRole('log', { name: /conversation with connect/i })).toHaveTextContent(/investors are the place to start/i)
    expect(screen.getByRole('button', { name: /lead generation/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resellers/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Hire Connect' }))
    expect(screen.getByRole('log')).toHaveTextContent(/Meet investors is the objective/i)
    expect(screen.getByRole('log')).toHaveTextContent(/stage, the check size/i)
    await user.click(screen.getByRole('link', { name: 'Objectives' }))
    expect(screen.getByRole('heading', { name: 'Meet investors' })).toBeInTheDocument()
    expect(screen.getAllByText('Investors').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Active', pressed: true })).toBeInTheDocument()
  })

  it('rejects a blank or invalid objective', async () => {
    const user = userEvent.setup()
    await renderAt('/')
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
    await renderAt('/')
    await reachIntro(user)
    expect(screen.getByRole('heading', { name: 'Maya Chen' })).toBeInTheDocument()
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

  it('keeps a demo conversation with Maya and the saved search across remount', async () => {
    const user = userEvent.setup()
    const first = await renderAt('/')
    await reachIntro(user)
    await user.click(screen.getByRole('button', { name: 'Talk with Maya Chen' }))
    const thread = await screen.findByRole('log', { name: /conversation with maya chen/i })
    expect(thread).toHaveTextContent(/fictional profile/i)
    expect(thread).toHaveTextContent(/Jordan Hale/)
    await user.type(screen.getByRole('textbox', { name: 'Message Maya Chen' }), 'What check size fits this seed round?')
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByRole('log', { name: /conversation with maya chen/i })).toHaveTextContent(/What check size fits this seed round\?/)
    expect(screen.getByRole('log', { name: /conversation with maya chen/i })).toHaveTextContent(/\$1–3M/)
    expect(screen.getByRole('log', { name: /conversation with maya chen/i })).toHaveTextContent(/not emailed|nothing in this thread is emailed/i)
    await storage.flushPersistence()
    first.unmount()

    await renderAt('/')
    expect(screen.getByRole('log', { name: /conversation with connect/i })).toHaveTextContent(/Meet investors is the objective/)
    expect(screen.getByRole('button', { name: 'Saved search Meet investors' })).toHaveTextContent(/infrastructure software/)
    await user.click(screen.getByRole('link', { name: /Maya Chen/ }))
    const restored = await screen.findByRole('log', { name: /conversation with maya chen/i })
    expect(restored).toHaveTextContent(/What check size fits this seed round\?/)
    expect(restored).toHaveTextContent(/\$1–3M/)
    await user.click(screen.getByRole('link', { name: 'Pipeline' }))
    expect(screen.getByRole('heading', { name: 'Maya Chen' })).toBeInTheDocument()
  })

  it('clears the saved workspace from this browser', async () => {
    const user = userEvent.setup()
    await renderAt('/')
    await user.click(screen.getByRole('button', { name: 'Hire Connect' }))
    await user.click(screen.getByRole('link', { name: 'Memory' }))
    await user.click(screen.getByRole('button', { name: 'Clear preview data' }))
    await user.click(screen.getByRole('button', { name: 'Confirm clear' }))
    await user.click(screen.getByRole('link', { name: 'Objectives' }))
    expect(await screen.findByRole('heading', { name: 'No objectives yet' })).toBeInTheDocument()
    await storage.flushPersistence()
    const saved = await storage.readState()
    expect(JSON.stringify(saved.data ?? {})).not.toContain('Meet investors')
  })

  it('shows a visible error when saving fails', async () => {
    vi.spyOn(storage, 'writeState').mockResolvedValue(WRITE_ERROR)
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppStateProvider>
          <AppRoutes />
        </AppStateProvider>
      </MemoryRouter>,
    )
    expect(await screen.findByRole('alert')).toHaveTextContent(WRITE_ERROR)
  })

  it('maps older objective kinds onto the investor-first set', () => {
    const base = freshState()
    const objective = (id: string, title: string, kind: string) => ({
      id,
      title,
      kind,
      status: 'active' as const,
      context: 'Seed infrastructure',
      timing: 'This quarter',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    const stored = {
      ...base,
      searches: [],
      threads: [],
      objectives: [objective('a', 'Raise', 'raise'), objective('b', 'Customers', 'customers'), objective('c', 'Partners', 'partners')],
    } as unknown as AppData
    const normalized = normalizeData(stored)
    expect(normalized.objectives.map((item) => item.kind)).toEqual(['investors', 'leads', 'resellers'])
    expect(normalized.searches).toHaveLength(3)
    expect(normalized.searches[0]?.criteria).toContain('Seed infrastructure')
  })
})