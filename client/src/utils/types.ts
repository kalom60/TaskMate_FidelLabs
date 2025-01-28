export enum TaskStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export type Subtask = {
  id: string;
  title: string;
};

export type File = {
  id: string;
  fileName: string;
  fileURL: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: TaskStatus;
  subtasks: Subtask[] | null;
  files: File[] | null;
};

export type UpdateTask = Omit<Task, "id" | "subtasks" | "files">;
