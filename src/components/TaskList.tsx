import type { Filter, Phase, Task } from "../types";
import { TaskItem } from "./TaskItem";

type TaskListProps = {
  phase: Phase;
  filter: Filter;
  tasks: Task[];
  total: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function emptyCopy(phase: Phase, filter: Filter, total: number) {
  if (phase === "error" && total === 0) {
    return {
      title: "Nothing loaded",
      body: "Saved tasks could not be opened. You can still add a new one.",
    };
  }
  if (total === 0) {
    return {
      title: "The list is clear",
      body: "Add the next outreach step. It stays in this browser after you reload.",
    };
  }
  if (filter === "active") {
    return {
      title: "No active tasks",
      body: "Everything on the list is complete. Switch to Completed to review it.",
    };
  }
  if (filter === "completed") {
    return {
      title: "No completed tasks",
      body: "Mark a task complete and it will show up in this view.",
    };
  }
  return {
    title: "The list is clear",
    body: "Add the next outreach step. It stays in this browser after you reload.",
  };
}

export function TaskList({
  phase,
  filter,
  tasks,
  total,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (phase === "loading") {
    return (
      <div
        className="loading"
        role="status"
        aria-live="polite"
        aria-label="Loading saved tasks"
      >
        <span className="skeleton" />
        <span className="skeleton short" />
        <span className="sr-only">Loading saved tasks</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    const copy = emptyCopy(phase, filter, total);
    return (
      <div className="empty">
        <p className="empty-title">{copy.title}</p>
        <p className="empty-body">{copy.body}</p>
      </div>
    );
  }

  return (
    <ul className="tasks" aria-label="Tasks">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
