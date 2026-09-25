export type Task = {
  id: string;
  name: string;
  completed: boolean;
  createdAt: number;
};

export type Filter = "all" | "active" | "completed";

export type Phase = "loading" | "ready" | "error";
