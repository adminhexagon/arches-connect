import { useState, type FormEvent } from "react";

type TaskComposerProps = {
  disabled?: boolean;
  onAdd: (name: string) => string | null;
};

export function TaskComposer({ disabled = false, onAdd }: TaskComposerProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = onAdd(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setName("");
  }

  return (
    <form className="composer" onSubmit={handleSubmit} noValidate>
      <label htmlFor="task-name">Task name</label>
      <div className="composer-row">
        <input
          id="task-name"
          name="taskName"
          value={name}
          disabled={disabled}
          placeholder="Name the next step"
          autoComplete="off"
          maxLength={180}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "task-name-error" : undefined}
          onChange={(event) => {
            const next = event.target.value;
            setName(next);
            if (error && next.trim()) {
              setError(null);
            }
          }}
        />
        <button type="submit" disabled={disabled}>
          Add task
        </button>
      </div>
      {error ? (
        <p id="task-name-error" className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
