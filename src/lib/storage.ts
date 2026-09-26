import { buildSearch } from './search'
import type { AppData, Memory, ObjectiveKind, PersonThread, Phase, SearchRecord, ThreadMessage } from '../types'

export const SCHEMA_VERSION = 2
export const LEGACY_STORAGE_KEY = 'arches-connect.v1'
export const STORAGE_KEY = LEGACY_STORAGE_KEY

export const READ_ERROR =
  "Saved workspace couldn't be read. This session won't overwrite it until you replace the saved data."

export const WRITE_ERROR =
  "Couldn't save to this browser. Your latest changes stay in this tab only."

const DB_NAME = 'arches-connect'
const DB_VERSION = 1
const STORE = 'workspace'
const RECORD_KEY = 'state'

const PHASES: Phase[] = ['awaiting_objective', 'awaiting_context', 'awaiting_timing', 'active']

const LEGACY_KIND: Record<string, ObjectiveKind> = {
  investors: 'investors',
  leads: 'leads',
  resellers: 'resellers',
  custom: 'custom',
  raise: 'investors',
  customers: 'leads',
  partners: 'resellers',
  advisors: 'custom',
  provider: 'custom',
}

let queue: Promise<unknown> = Promise.resolve()

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task)
  queue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

export function flushPersistence(): Promise<void> {
  return queue.then(() => undefined)
}

function normalizeKind(value: unknown): ObjectiveKind {
  if (typeof value === 'string' && value in LEGACY_KIND) return LEGACY_KIND[value]
  return 'custom'
}

function isMemory(value: unknown): value is Memory {
  if (!value || typeof value !== 'object') return false
  const memory = value as Memory
  return (
    typeof memory.objectiveSummary === 'string' &&
    Array.isArray(memory.preferences) &&
    Array.isArray(memory.outcomes)
  )
}

export function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false
  const data = value as AppData
  return (
    Array.isArray(data.objectives) &&
    Array.isArray(data.opportunities) &&
    Array.isArray(data.messages) &&
    isMemory(data.memory) &&
    PHASES.includes(data.phase) &&
    (data.activeObjectiveId === null || typeof data.activeObjectiveId === 'string')
  )
}

function normalizeSearch(value: unknown): SearchRecord | null {
  if (!value || typeof value !== 'object') return null
  const search = value as Partial<SearchRecord>
  if (typeof search.id !== 'string' || typeof search.title !== 'string') return null
  return {
    id: search.id,
    objectiveId: typeof search.objectiveId === 'string' ? search.objectiveId : '',
    title: search.title,
    kind: normalizeKind(search.kind),
    context: search.context ?? '',
    timing: search.timing ?? '',
    criteria: search.criteria ?? '',
    stage: search.stage ?? '',
    checkSize: search.checkSize ?? '',
    thesis: search.thesis ?? '',
    geography: search.geography ?? '',
    createdAt: search.createdAt ?? '',
  }
}

function normalizeMessage(value: unknown): ThreadMessage | null {
  if (!value || typeof value !== 'object') return null
  const message = value as Partial<ThreadMessage>
  if (typeof message.id !== 'string' || typeof message.text !== 'string') return null
  if (message.role !== 'user' && message.role !== 'person') return null
  return { id: message.id, role: message.role, text: message.text, at: message.at ?? '' }
}

function normalizeThread(value: unknown): PersonThread | null {
  if (!value || typeof value !== 'object') return null
  const thread = value as Partial<PersonThread>
  if (typeof thread.id !== 'string' || typeof thread.personId !== 'string') return null
  const messages = Array.isArray(thread.messages)
    ? thread.messages.map(normalizeMessage).filter((item): item is ThreadMessage => Boolean(item))
    : []
  return {
    id: thread.id,
    personId: thread.personId,
    objectiveId: typeof thread.objectiveId === 'string' ? thread.objectiveId : '',
    opportunityId: typeof thread.opportunityId === 'string' ? thread.opportunityId : '',
    messages,
    createdAt: thread.createdAt ?? '',
    updatedAt: thread.updatedAt ?? '',
  }
}

export function normalizeData(data: AppData): AppData {
  const objectives = data.objectives.map((objective) => ({
    ...objective,
    kind: normalizeKind(objective.kind),
  }))
  const storedSearches = Array.isArray(data.searches)
    ? data.searches.map(normalizeSearch).filter((item): item is SearchRecord => Boolean(item))
    : []
  const searches =
    storedSearches.length > 0
      ? storedSearches
      : objectives.filter((objective) => objective.context && objective.timing).map((objective) => buildSearch(objective))
  const threads = Array.isArray(data.threads)
    ? data.threads.map(normalizeThread).filter((item): item is PersonThread => Boolean(item))
    : []
  return {
    ...data,
    objectives,
    searches,
    threads,
    pinnedIds: Array.isArray(data.pinnedIds) ? data.pinnedIds.filter((id) => typeof id === 'string') : [],
    memory: {
      objectiveSummary: data.memory.objectiveSummary ?? '',
      summaryCustom: Boolean(data.memory.summaryCustom),
      preferences: data.memory.preferences ?? [],
      outcomes: data.memory.outcomes ?? [],
      corrections: data.memory.corrections ?? [],
    },
  }
}

function parseEnvelope(value: unknown): AppData | null {
  if (!value || typeof value !== 'object') return null
  const envelope = value as { version?: number; data?: unknown }
  if ((envelope.version !== 1 && envelope.version !== SCHEMA_VERSION) || !isAppData(envelope.data)) return null
  return normalizeData(envelope.data)
}

function readLegacy(): { data: AppData | null; error: string | null } {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return { data: null, error: null }
    const parsed: unknown = JSON.parse(raw)
    const data = parseEnvelope(parsed)
    if (!data) return { data: null, error: READ_ERROR }
    return { data, error: null }
  } catch {
    return { data: null, error: READ_ERROR }
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is unavailable'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open the workspace database'))
  })
}

function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const request = run(tx.objectStore(STORE))
        tx.oncomplete = () => {
          db.close()
          resolve(request.result)
        }
        tx.onerror = () => {
          db.close()
          reject(tx.error ?? request.error ?? new Error('Workspace database request failed'))
        }
        tx.onabort = () => {
          db.close()
          reject(tx.error ?? new Error('Workspace database request was aborted'))
        }
      }),
  )
}

async function readIndexed(): Promise<AppData | null> {
  const stored = await withStore<unknown>('readonly', (store) => store.get(RECORD_KEY))
  if (stored == null) return null
  return parseEnvelope(stored)
}

async function writeIndexed(data: AppData): Promise<void> {
  const envelope = { version: SCHEMA_VERSION, savedAt: new Date().toISOString(), data }
  await withStore('readwrite', (store) => store.put(envelope, RECORD_KEY))
}

async function deleteIndexed(): Promise<void> {
  await withStore('readwrite', (store) => store.delete(RECORD_KEY))
}

async function readStateInner(): Promise<{ data: AppData | null; error: string | null }> {
  try {
    const indexed = await readIndexed()
    if (indexed) return { data: indexed, error: null }
    return readLegacy()
  } catch {
    return { data: null, error: READ_ERROR }
  }
}

async function writeStateInner(data: AppData): Promise<string | null> {
  try {
    await writeIndexed(normalizeData(data))
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {
      // The durable copy is in IndexedDB. A leftover legacy key is not the live store.
    }
    return null
  } catch {
    return WRITE_ERROR
  }
}

async function clearStateInner(): Promise<string | null> {
  try {
    await deleteIndexed()
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    return null
  } catch {
    return "Couldn't clear saved data in this browser."
  }
}

export function readState(): Promise<{ data: AppData | null; error: string | null }> {
  return enqueue(readStateInner)
}

export function writeState(data: AppData): Promise<string | null> {
  return enqueue(() => writeStateInner(data))
}

export function clearState(): Promise<string | null> {
  return enqueue(clearStateInner)
}
