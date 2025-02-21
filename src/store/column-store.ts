// src/stores/column-store.ts
import { create } from "zustand";
import {
  Column,
  CreateColumnInput,
  UpdateColumnInput,
} from "@/lib/types/column";
import { columnService } from "@/lib/services/column-service";

interface ColumnState {
  columns: Column[];
  loading: boolean;
  isOperating: boolean;
  isDragging: boolean;
  error: string | null;
  currentBoardId: string | null;

  // Actions
  fetchColumns: (boardId: string) => Promise<void>;
  createColumn: (data: CreateColumnInput) => Promise<Column>;
  updateColumn: (columnId: string, data: UpdateColumnInput) => Promise<void>;
  deleteColumn: (columnId: string) => Promise<void>;
  updateColumnOrder: (
    boardId: string,
    columnId: string,
    newOrder: number
  ) => Promise<void>;
  resetColumns: () => void; // Yeni eklenen fonksiyon

  // Local state updates
  setColumns: (columns: Column[]) => void;
  addColumn: (column: Column) => void;
  removeColumn: (columnId: string) => void;
  updateLocalColumn: (columnId: string, data: Partial<Column>) => void;
}

export const useColumnStore = create<ColumnState>((set, get) => ({
  columns: [],
  loading: false,
  isOperating: false,
  isDragging: false,
  error: null,
  currentBoardId: null,

  fetchColumns: async (boardId: string) => {
    const { currentBoardId } = get();

    // Reset columns if board has changed
    if (currentBoardId !== boardId) {
      get().resetColumns();
    }

    set({ loading: true, error: null, currentBoardId: boardId });
    try {
      const columns = await columnService.getBoardColumns(boardId);
      set({ columns, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch columns",
        loading: false,
      });
    }
  },

  // Reset state
  resetColumns: () => {
    set({
      columns: [],
      currentBoardId: null,
      error: null,
    });
  },

  // ... diğer fonksiyonlar aynı kalacak

  createColumn: async (data: CreateColumnInput) => {
    set({ isOperating: true, error: null });
    try {
      const newColumn = await columnService.createColumn(data);
      get().addColumn(newColumn);
      set({ isOperating: false });
      return newColumn;
    } catch (error: any) {
      set({
        error: error.message || "Failed to create column",
        isOperating: false,
      });
      throw error;
    }
  },

  updateColumn: async (columnId: string, data: UpdateColumnInput) => {
    set({ isOperating: true, error: null });
    try {
      const updatedColumn = await columnService.updateColumn(columnId, data);
      get().updateLocalColumn(columnId, updatedColumn);
      set({ isOperating: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to update column",
        isOperating: false,
      });
      throw error;
    }
  },

  deleteColumn: async (columnId: string) => {
    set({ isOperating: true, error: null });
    try {
      await columnService.deleteColumn(columnId);
      get().removeColumn(columnId);
      set({ isOperating: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete column",
        isOperating: false,
      });
      throw error;
    }
  },

  updateColumnOrder: async (
    boardId: string,
    columnId: string,
    newOrder: number
  ) => {
    const previousColumns = [...get().columns];
    set({ isDragging: true, error: null });

    try {
      // Önce local state'i güncelle
      const columns = [...previousColumns];
      const oldIndex = columns.findIndex((col) => col._id === columnId);
      const [movedColumn] = columns.splice(oldIndex, 1);
      columns.splice(newOrder, 0, movedColumn);

      // Sıra numaralarını güncelle
      const updatedColumns = columns.map((col, index) => ({
        ...col,
        order: index,
      }));

      set({ columns: updatedColumns });

      await columnService.updateColumnOrder(boardId, { columnId, newOrder });
    } catch (error: any) {
      set({
        columns: previousColumns,
        error: error.message || "Failed to update column order",
      });
      throw error;
    } finally {
      set({ isDragging: false });
    }
  },

  setColumns: (columns) => set({ columns }),
  addColumn: (column) =>
    set((state) => ({
      columns: [...state.columns, column],
    })),
  removeColumn: (columnId) =>
    set((state) => ({
      columns: state.columns.filter((col) => col._id !== columnId),
    })),
  updateLocalColumn: (columnId, data) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col._id === columnId ? { ...col, ...data } : col
      ),
    })),
}));
