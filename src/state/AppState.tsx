import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { createContext, useContext } from 'react'
import * as storage from '../lib/storage'
import { freshState, reducer, type Action } from './reducer'
import type { AppData } from '../types'

interface Store {
  state: AppData
  ready: boolean
  storageError: string | null
  persistBlocked: boolean
  dispatch: (action: Action) => void
  replaceSaved: () => void
  resetWorkspace: () => void
}

const AppStateContext = createContext<Store | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, freshState())
  const [ready, setReady] = useState(false)
  const [storageError, setStorageError] = useState<string | null>(null)
  const [persist, setPersist] = useState(true)

  useEffect(() => {
    let cancel = false
    void storage.readState().then((loaded) => {
      if (cancel) return
      if (loaded.error) {
        setStorageError(loaded.error)
        setPersist(false)
      } else if (loaded.data) {
        dispatch({ type: 'hydrate', data: loaded.data })
      }
      setReady(true)
    })
    return () => {
      cancel = true
    }
  }, [])

  useEffect(() => {
    if (!ready || !persist) return
    let cancel = false
    void storage.writeState(state).then((error) => {
      if (cancel) return
      setStorageError((current) => {
        if (error) return error
        return current === storage.WRITE_ERROR ? null : current
      })
    })
    return () => {
      cancel = true
    }
  }, [state, ready, persist])

  const store = useMemo<Store>(
    () => ({
      state,
      ready,
      storageError,
      persistBlocked: !persist,
      dispatch,
      replaceSaved: () => {
        setPersist(true)
        void storage.writeState(state).then((error) => setStorageError(error))
      },
      resetWorkspace: () => {
        void storage.clearState().then((error) => {
          if (error) {
            setStorageError(error)
            return
          }
          setPersist(true)
          setStorageError(null)
          dispatch({ type: 'reset' })
        })
      },
    }),
    [state, ready, storageError, persist],
  )

  return <AppStateContext.Provider value={store}>{children}</AppStateContext.Provider>
}

export function useAppState(): Store {
  const store = useContext(AppStateContext)
  if (!store) throw new Error('useAppState must be used within AppStateProvider')
  return store
}
