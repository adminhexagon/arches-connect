import type { Task } from "./types";

export const STORAGE_KEY = "arches-connect.tasks.v1";

export const READ_ERROR =
  "Could not read saved tasks. Showing an empty list until storage works again.";

export const PARSE_ERROR =
  "Saved tasks could not be read. They look damaged, so nothing was loaded.";

export const WRITE_ERROR =
  "Could not save tasks on this device. Your latest change is visible now, but it may disappear after a reload.";

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

function parseTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) {
    throw new StorageError(PARSE_ERROR);
  }

  return value.map((item) => {
    if (!item || typeof item !== "object") {
      throw new StorageError(PARSE_ERROR);
    }

    const row = item as Record<string, unknown>;
    if (
      typeof row.id !== "string" ||
      row.id.trim() === "" ||
      typeof row.name !== "string" ||
      row.name.trim() === "" ||
      typeof row.completed !== "boolean" ||
      typeof row.createdAt !== "number" ||
      !Number.isFinite(row.createdAt)
    ) {
      throw new StorageError(PARSE_ERROR);
    }

    return {
      id: row.id,
      name: row.name,
      completed: row.completed,
      createdAt: row.createdAt,
    };
  });
}

export function loadTasks(): Task[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    throw new StorageError(READ_ERROR);
  }

  if (raw === null || raw.trim() === "") {
    return [];
  }

  try {
    return parseTasks(JSON.parse(raw));
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError(PARSE_ERROR);
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    throw new StorageError(WRITE_ERROR);
  }
}
