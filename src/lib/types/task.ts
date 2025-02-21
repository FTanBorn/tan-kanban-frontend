// src/lib/types/task.ts

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  BLOCKED = "blocked",
}

export interface TaskAssignee {
  _id: string;
  name: string;
  email: string;
}

export interface TaskComment {
  _id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assignees: TaskAssignee[];
  labels: string[];
  comments: TaskComment[];
  order: number;
  columnId: string;
}

// Input Types for Operations
export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string; // Changed from Date to string
  assignees?: string[];
  labels?: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  order?: number;
}

export interface MoveTaskInput {
  targetColumnId: string;
  order: number;
}
