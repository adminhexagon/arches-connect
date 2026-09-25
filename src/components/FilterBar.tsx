import type { Filter } from "../types";

type FilterBarProps = {
  filter: Filter;
  counts: Record<Filter, number>;
  onChange: (filter: Filter) => void;
  disabled?: boolean;
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

export function FilterBar({
  filter,
  counts,
  onChange,
  disabled = false,
}: FilterBarProps) {
  return (
    <div className="filters" role="group" aria-label="Filter tasks">
      {FILTERS.map((item) => {
        const selected = filter === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={selected ? "filter is-selected" : "filter"}
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => onChange(item.id)}
          >
            <span>{item.label}</span>
            <span className="count">{counts[item.id]}</span>
          </button>
        );
      })}
    </div>
  );
}
