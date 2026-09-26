import { useAppState } from '../state/AppState'

export function StorageBanner() {
  const { storageError, persistBlocked, replaceSaved } = useAppState()
  if (!storageError) return null
  return (
    <div className="storage-banner" role="alert">
      <p>{storageError}</p>
      {persistBlocked ? (
        <button type="button" className="btn btn-small btn-secondary" onClick={replaceSaved}>
          Replace saved data
        </button>
      ) : null}
    </div>
  )
}
