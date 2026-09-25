import { useLayoutEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { clearState, readState, writeState } from '../lib/storage'
import { freshState, reducer, type Action } from './reducer'
import type { AppData } from '../types'

interface Store {
  state: AppData
  storageError: string | null
  persistBlocked: boolean
  dispatch: (action: Action) => void
  replaceSaved: () => void
  resetWorkspace: () => void
}

const AppStateContext = createContext<Store | null>(null)

function loadInitial(): { data: AppData; error: string | null; persist: boolean } {
  const loaded = readState()
  if (loaded.error) return { data: freshState(), error: loaded.error, persist: false }
  if (loaded.data) return { data: loaded.data, error: null, persist: true }
  return { data: freshState(), error: null, persist: true }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [bundle] = useState(loadInitial)
  const [state, dispatch] = useReducer(reducer, bundle.data)
  const [storageError, setStorageError] = useState<string | null>(bundle.error)
  const [persist, setPersist] = useState(bundle.persist)

  useLayoutEffect(() => {
    if (!persist) return
    const error = writeState(state)
    setStorageError((current) => (current === error ? current : error))
  }, [state, persist])

  const store = useMemo<Store>(
    () => ({
      state,
      storageError,
      persistBlocked: !persist,
      dispatch,
      replaceSaved: () => {
        setPersist(true)
        const error = writeState(state)
        setStorageError(error)
      },
      resetWorkspace: () => {
        const error = clearState()
        if (error) {
          setStorageError(error)
          return
        }
        setPersist(true)
        setStorageError(null)
        dispatch({ type: 'reset' })
      },
    }),
    [state, storageError, persist],
  )

  return <AppStateContext.Provider value={store}>{children}</AppStateContext.Provider>
}

export function useAppState(): Store {
  const store = useContext(AppStateContext)
  if (!store) throw new Error('useAppState must be used within AppStateProvider')
  return store
}
