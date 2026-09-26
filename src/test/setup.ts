import 'fake-indexeddb/auto'
import '@testing-library/jest-dom/vitest'
import { IDBFactory } from 'fake-indexeddb'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

beforeEach(() => {
  localStorage.clear()
  globalThis.indexedDB = new IDBFactory()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})
