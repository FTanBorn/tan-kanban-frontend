// src/lib/types/column.ts

export type ColumnType = "todo" | "in-progress" | "done" | "custom";

export interface Column {
  _id: string;
  name: string;
  boardId: string;
  order: number;
  type: ColumnType;
  color?: string;
  limit?: number;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateColumnInput {
  name: string;
  boardId: string;
  type?: ColumnType;
  color?: string;
  limit?: number;
}

export interface UpdateColumnInput {
  name?: string;
  type?: ColumnType;
  color?: string;
  limit?: number;
}

export interface UpdateColumnOrderInput {
  columnId: string;
  newOrder: number;
}

// Task interface'i şimdilik basit tutuyoruz, daha sonra genişleteceğiz
interface Task {
  _id: string;
  title: string;
  description?: string;
  order: number;
  columnId: string;
}
