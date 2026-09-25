import type { Task } from "../types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li
      className={task.completed ? "task is-complete" : "task"}
      data-status={task.completed ? "completed" : "active"}
    >
      <label className="check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-copy">
          <span className="task-name">{task.name}</span>
          <span className="task-state">
            {task.completed ? "Completed" : "Active"}
          </span>
        </span>
      </label>
      <button
        type="button"
        className="delete"
        aria-label={`Delete ${task.name}`}
        onClick={() => onDelete(task.id)}
      >
        <span aria-hidden="true">Remove</span>
      </button>
    </li>
  );
}
