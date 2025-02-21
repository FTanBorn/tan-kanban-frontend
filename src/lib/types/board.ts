// src/lib/types/board.ts
import { Task } from "./task";

export type ColumnType = "todo" | "in-progress" | "done" | "custom";

export interface SimpleBoard {
  _id: string;
  name: string;
  description?: string;
  owner?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface Column {
  _id: string;
  name: string;
  order: number;
  isDefault: boolean;
  type: ColumnType;
  color: string;
  limit?: number;
  tasks: Task[];
}

export interface Board {
  _id: string;
  name: string;
  description?: string;
  owner: any; // User ID
  members: string[]; // User IDs
  columns: Column[];
}

// Input Types for Operations
export interface CreateBoardInput {
  name: string;
  description?: string;
}

export interface UpdateBoardInput {
  name?: string;
  description?: string;
}

export interface CreateColumnInput {
  name: string;
  type: ColumnType;
  limit?: number;
  color?: string;
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
