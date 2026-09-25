import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from './App'
import { STORAGE_KEY, WRITE_ERROR } from './lib/storage'
import { AppStateProvider } from './state/AppState'

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
  await user.type(screen.getByRole('textbox', { name: 'Message Connect' }), 'Win customers')
  await user.click(screen.getByRole('button', { name: 'Send' }))
  await user.type(
    screen.getByRole('textbox', { name: 'Message Connect' }),
    'We sell a billing API to logistics operators',
  )
  await user.click(screen.getByRole('button', { name: 'Send' }))
  await user.type(screen.getByRole('textbox', { name: 'Message Connect' }), 'This quarter')
  await user.click(screen.getByRole('button', { name: 'Send' }))
}

describe('Arches Connect', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates an objective from the landing page', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const hires = screen.getAllByRole('link', { name: 'Hire Connect' })
    await user.click(hires[0])
    expect(screen.getByRole('log')).toHaveTextContent(/what are you trying to achieve/i)
    await user.click(screen.getByRole('button', { name: /win customers/i }))
    expect(screen.getByRole('log')).toHaveTextContent(/Win customers is the objective/i)
    await user.click(screen.getByRole('link', { name: 'Objectives' }))
    expect(screen.getByRole('heading', { name: 'Win customers' })).toBeInTheDocument()
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

  it('approves an intro, moves the pipeline, and shows the next move', async () => {
    const user = userEvent.setup()
    renderAt('/app/chat')
    await reachIntro(user)
    expect(screen.getByRole('button', { name: 'Approve intro' })).toBeInTheDocument()
    expect(screen.getByText('Lena Voss')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Approve intro' }))
    expect(screen.getByRole('log')).toHaveTextContent(/Next move:/)
    expect(screen.getByRole('log')).toHaveTextContent(/Nothing was emailed/)
    expect(screen.getByRole('button', { name: 'Mark introduced' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Pipeline' }))
    expect(screen.getByRole('heading', { name: 'Lena Voss' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^Approved/ }))
    expect(screen.getByRole('heading', { name: 'Lena Voss' })).toBeInTheDocument()
    expect(screen.queryByText('Jonah Blake')).not.toBeInTheDocument()
    expect(screen.queryByText('Chris Adeyemi')).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Objectives' }))
    expect(screen.getByText(/You approved the intro draft. Nothing was emailed./)).toBeInTheDocument()
  })

  it('persists the objective and chat across a remount', async () => {
    const user = userEvent.setup()
    const first = renderAt('/app/chat')
    await user.click(screen.getByRole('button', { name: /win customers/i }))
    expect(screen.getByRole('log')).toHaveTextContent(/Win customers is the objective/i)
    first.unmount()

    renderAt('/app/objectives')
    expect(screen.getByRole('heading', { name: 'Win customers' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Chat' }))
    expect(screen.getByRole('log')).toHaveTextContent(/Win customers is the objective/i)
  })

  it('clears the saved preview from this browser', async () => {
    const user = userEvent.setup()
    renderAt('/app/chat')
    await user.click(screen.getByRole('button', { name: /win customers/i }))
    await user.click(screen.getByRole('link', { name: 'Memory' }))
    await user.click(screen.getByRole('button', { name: 'Clear preview data' }))
    await user.click(screen.getByRole('button', { name: 'Confirm clear' }))
    await user.click(screen.getByRole('link', { name: 'Objectives' }))
    expect(screen.getByRole('heading', { name: 'No objectives yet' })).toBeInTheDocument()
    expect(localStorage.getItem(STORAGE_KEY) ?? '').not.toContain('Win customers')
  })

  it('shows a visible error when saving fails', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('quota', 'QuotaExceededError')
    })
    renderAt('/app/chat')
    expect(await screen.findByRole('alert')).toHaveTextContent(WRITE_ERROR)
  })
})
