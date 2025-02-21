// src/lib/types/board.ts
import { Task } from "./task";

export enum ColumnType {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
  CUSTOM = "custom",
}

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
  color: string;
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
