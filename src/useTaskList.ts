import { useCallback, useEffect, useMemo, useState } from "react";
import { loadTasks, saveTasks, StorageError, WRITE_ERROR } from "./storage";
import type { Filter, Phase, Task } from "./types";

export const BLANK_NAME_ERROR =
  "Enter a task name before adding it. Spaces alone do not count.";

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useTaskList() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [storageError, setStorageError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      setTasks(loadTasks());
      setPhase("ready");
    } catch (error) {
      setTasks([]);
      setStorageError(
        error instanceof StorageError
          ? error.message
          : "Could not read saved tasks.",
      );
      setPhase("error");
    }
  }, []);

  const persist = useCallback((next: Task[], success: string | null) => {
    setTasks(next);
    try {
      saveTasks(next);
      setStorageError(null);
      setSuccessMessage(success);
      setPhase("ready");
    } catch (error) {
      setSuccessMessage(null);
      setStorageError(
        error instanceof StorageError ? error.message : WRITE_ERROR,
      );
      setPhase("ready");
    }
  }, []);

  const addTask = useCallback(
    (rawName: string): string | null => {
      const name = rawName.trim();
      if (!name) {
        setSuccessMessage(null);
        return BLANK_NAME_ERROR;
      }

      const task: Task = {
        id: createId(),
        name,
        completed: false,
        createdAt: Date.now(),
      };
      persist([task, ...tasks], `Added “${name}”.`);
      return null;
    },
    [persist, tasks],
  );

  const toggleTask = useCallback(
    (id: string) => {
      const current = tasks.find((task) => task.id === id);
      if (!current) {
        return;
      }
      const next = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      );
      const message = current.completed
        ? `Marked “${current.name}” active.`
        : `Completed “${current.name}”.`;
      persist(next, message);
    },
    [persist, tasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      const current = tasks.find((task) => task.id === id);
      persist(
        tasks.filter((task) => task.id !== id),
        current ? `Removed “${current.name}”.` : null,
      );
    },
    [persist, tasks],
  );

  const clearCompleted = useCallback(() => {
    persist(
      tasks.filter((task) => !task.completed),
      "Cleared completed tasks.",
    );
  }, [persist, tasks]);

  const counts = useMemo(
    () => ({
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks],
  );

  const visibleTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  }, [filter, tasks]);

  return {
    phase,
    visibleTasks,
    filter,
    setFilter,
    counts,
    storageError,
    successMessage,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted,
  };
}
