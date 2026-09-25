import { FilterBar } from "./components/FilterBar";
import { Mark } from "./components/Mark";
import { TaskComposer } from "./components/TaskComposer";
import { TaskList } from "./components/TaskList";
import { useTaskList } from "./useTaskList";

export function App() {
  const {
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
  } = useTaskList();

  const loading = phase === "loading";
  const progressMax = counts.all;
  const progressNow = counts.completed;
  const progressLabel =
    progressMax === 0
      ? "No tasks yet"
      : `${progressNow} of ${progressMax} complete`;

  return (
    <div className="shell">
      <a className="skip" href="#task-name">
        Skip to task name
      </a>
      <main className="panel">
        <header className="mast">
          <div className="brand">
            <Mark />
            <p className="wordmark">Arches Connect</p>
          </div>
          <p className="kicker">Outreach ledger</p>
          <h1>Keep the outreach moving.</h1>
          <p className="lede">
            A short list for the next introduction, follow-up, or note. Tasks
            stay on this device.
          </p>
        </header>

        {storageError ? (
          <div className="banner" role="alert">
            {storageError}
          </div>
        ) : null}

        {successMessage ? (
          <p className="toast" role="status">
            {successMessage}
          </p>
        ) : null}

        <TaskComposer disabled={loading} onAdd={addTask} />
        <FilterBar
          filter={filter}
          counts={counts}
          disabled={loading}
          onChange={setFilter}
        />

        <div className="progress-row">
          <p className="progress-label">{loading ? "Loading tasks" : progressLabel}</p>
          {progressMax > 0 ? (
            <div
              className="progress"
              role="progressbar"
              aria-label="Completed tasks"
              aria-valuemin={0}
              aria-valuemax={progressMax}
              aria-valuenow={progressNow}
            >
              <span
                style={{
                  width: `${Math.round((progressNow / progressMax) * 100)}%`,
                }}
              />
            </div>
          ) : null}
        </div>

        <TaskList
          phase={phase}
          filter={filter}
          tasks={visibleTasks}
          total={counts.all}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />

        <footer className="foot">
          <p>Stored locally in this browser.</p>
          {counts.completed > 0 ? (
            <button type="button" className="text-button" onClick={clearCompleted}>
              Clear completed
            </button>
          ) : null}
        </footer>
      </main>
    </div>
  );
}
