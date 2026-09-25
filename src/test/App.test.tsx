import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../App";
import { STORAGE_KEY, WRITE_ERROR } from "../storage";

beforeEach(() => {
  localStorage.clear();
});

async function ready() {
  expect(await screen.findByText("The list is clear")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Add task" })).toBeEnabled();
}

async function addTask(name: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Task name"), name);
  await user.click(screen.getByRole("button", { name: "Add task" }));
  return user;
}

describe("task list", () => {
  it("creates a task, completes it, filters, and restores after remount", async () => {
    const user = userEvent.setup();
    const view = render(<App />);
    await ready();

    await user.type(screen.getByLabelText("Task name"), "Send the intro");
    await user.click(screen.getByRole("button", { name: "Add task" }));
    expect(screen.getByRole("status")).toHaveTextContent("Added “Send the intro”.");

    await user.type(screen.getByLabelText("Task name"), "Book the follow-up");
    await user.click(screen.getByRole("button", { name: "Add task" }));

    const intro = screen.getByRole("checkbox", { name: /Send the intro/ });
    await user.click(intro);
    expect(intro).toBeChecked();
    expect(
      within(intro.closest("li") as HTMLElement).getByText("Completed"),
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByRole("checkbox", { name: /Book the follow-up/ }).closest(
          "li",
        ) as HTMLElement,
      ).getByText("Active"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^Active/ }));
    expect(screen.queryByRole("checkbox", { name: /Send the intro/ })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Book the follow-up/ })).toBeInTheDocument();
    expect(screen.queryByText("No active tasks")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^Completed/ }));
    expect(screen.getByRole("checkbox", { name: /Send the intro/ })).toBeChecked();
    expect(
      screen.queryByRole("checkbox", { name: /Book the follow-up/ }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^All/ }));
    expect(screen.getByRole("checkbox", { name: /Send the intro/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Book the follow-up/ })).not.toBeChecked();

    view.unmount();
    render(<App />);
    expect(await screen.findByRole("checkbox", { name: /Send the intro/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /Book the follow-up/ })).not.toBeChecked();

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Array<{
      name: string;
      completed: boolean;
    }>;
    expect(stored).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Send the intro", completed: true }),
        expect.objectContaining({ name: "Book the follow-up", completed: false }),
      ]),
    );
  });

  it("rejects blank and whitespace-only task names", async () => {
    const user = userEvent.setup();
    render(<App />);
    await ready();

    await user.click(screen.getByRole("button", { name: "Add task" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/Enter a task name/i);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    await user.type(screen.getByLabelText("Task name"), "   ");
    await user.click(screen.getByRole("button", { name: "Add task" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/Spaces alone do not count/i);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("shows a visible error when saving fails", async () => {
    render(<App />);
    await ready();

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });

    await addTask("Call Maya");
    expect(screen.getByRole("alert")).toHaveTextContent(WRITE_ERROR);
    expect(screen.getByRole("checkbox", { name: /Call Maya/ })).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows a visible error when reading saved tasks fails", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });

    render(<App />);
    expect(await screen.findByRole("alert")).toHaveTextContent(/Could not read saved tasks/i);
    expect(screen.getByText("Nothing loaded")).toBeInTheDocument();
  });
});
