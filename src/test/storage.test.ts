import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  PARSE_ERROR,
  READ_ERROR,
  STORAGE_KEY,
  WRITE_ERROR,
  loadTasks,
  saveTasks,
} from "../storage";
import type { Task } from "../types";

const sample: Task = {
  id: "task-1",
  name: "Send the intro",
  completed: false,
  createdAt: 1_700_000_000_000,
};

beforeEach(() => {
  localStorage.clear();
});

describe("task storage", () => {
  it("returns an empty list when nothing is stored", () => {
    expect(loadTasks()).toEqual([]);
  });

  it("round-trips tasks through localStorage", () => {
    saveTasks([sample]);
    expect(loadTasks()).toEqual([sample]);
    expect(localStorage.getItem(STORAGE_KEY)).toContain("Send the intro");
  });

  it("rejects damaged stored data", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(() => loadTasks()).toThrow(PARSE_ERROR);

    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ name: "   " }]));
    expect(() => loadTasks()).toThrow(PARSE_ERROR);
  });

  it("surfaces read failures", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(() => loadTasks()).toThrow(READ_ERROR);
  });

  it("surfaces write failures", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => saveTasks([sample])).toThrow(WRITE_ERROR);
  });
});
