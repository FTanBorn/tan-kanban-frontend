// src/store/board-store.ts
import { create } from "zustand";
import {
  Board,
  Column,
  CreateBoardInput,
  CreateColumnInput,
  UpdateColumnInput,
} from "@/lib/types/board";
import { boardService } from "@/lib/services/board-service";
import { columnService } from "@/lib/services/column-service";
import { taskService } from "@/lib/services/task-service";
import {
  CreateTaskInput,
  MoveTaskInput,
  Task,
  UpdateTaskInput,
} from "@/lib/types/task";

interface BoardState {
  boards: any[];
  activeBoard: Board | null;
  loading: boolean;
  initialized: boolean; // Yeni: İlk fetch yapıldı mı kontrolü
  error: string | null;

  // Board Actions
  fetchBoards: () => Promise<void>;
  fetchBoardDetails: (boardId: string) => Promise<void>;
  createBoard: (data: CreateBoardInput) => Promise<Board>;
  updateBoard: (
    boardId: string,
    data: Partial<CreateBoardInput>
  ) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  leaveBoard: (boardId: string) => Promise<void>; // Yeni eklenen
  addMember: (boardId: string, email: string) => Promise<void>;
  setActiveBoard: (board: Board | null) => void;

  // Column Actions
  addColumn: (boardId: string, data: CreateColumnInput) => Promise<void>;
  updateColumn: (
    boardId: string,
    columnId: string,
    data: UpdateColumnInput
  ) => Promise<void>;
  deleteColumn: (boardId: string, columnId: string) => Promise<void>;
  updateColumnOrder: (
    boardId: string,
    columnId: string,
    newOrder: number
  ) => Promise<void>;

  // Task Operations - Yeni Eklenecek
  moveTask: (
    boardId: string,
    taskId: string,
    data: MoveTaskInput
  ) => Promise<void>;
  createTask: (
    boardId: string,
    columnId: string,
    data: CreateTaskInput
  ) => Promise<void>;
  updateTask: (
    boardId: string,
    taskId: string,
    data: UpdateTaskInput
  ) => Promise<void>;
  deleteTask: (boardId: string, taskId: string) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  activeBoard: null,
  loading: false,
  initialized: false,
  error: null,

  fetchBoards: async () => {
    // Eğer zaten yüklenmiş ve veriler varsa, tekrar fetch etme
    if (get().initialized && get().boards.length > 0) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const boards = await boardService.getBoards();
      set({
        boards,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      console.log(error);
      set({
        error: "Failed to fetch boards",
        loading: false,
        initialized: false,
      });
    }
  },

  fetchBoardDetails: async (boardId: string) => {
    set({ loading: true, error: null });
    try {
      const board = await boardService.getBoardDetails(boardId);
      set({ activeBoard: board, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch board details", loading: false });
      throw error;
    }
  },

  createBoard: async (data) => {
    set({ loading: true, error: null });
    try {
      const newBoard = await boardService.createBoard(data);
      set((state: any) => ({
        boards: [...state.boards, newBoard],
        loading: false,
      }));
      return newBoard;
    } catch (error) {
      set({ error: "Failed to create board", loading: false });
      throw error;
    }
  },

  updateBoard: async (boardId, data) => {
    set({ loading: true, error: null });
    try {
      const updatedBoard = await boardService.updateBoard(boardId, data);

      set((state) => ({
        boards: state.boards.map(
          (board) =>
            board._id === boardId ? { ...board, ...updatedBoard } : board // Tüm tahta verilerini güncelle
        ),
        activeBoard:
          state.activeBoard?._id === boardId
            ? { ...state.activeBoard, ...updatedBoard }
            : state.activeBoard,
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update board", loading: false });
      throw error;
    }
  },

  deleteBoard: async (boardId) => {
    const originalState = get(); // Orijinal state'i yedekle
    try {
      set({ loading: true, error: null });

      // Optimistic update
      set((state) => ({
        boards: state.boards.filter((board) => board._id !== boardId),
        activeBoard:
          state.activeBoard?._id === boardId ? null : state.activeBoard,
      }));

      await boardService.deleteBoard(boardId);
    } catch (error) {
      // Hata durumunda orijinal state'i geri yükle
      console.log(error);
      set(originalState);
      throw new Error("Failed to delete board");
    } finally {
      set({ loading: false });
    }
  },

  addMember: async (boardId, email) => {
    set({ loading: true, error: null });
    try {
      const updatedBoard = await boardService.addMember(boardId, email);
      set((state) => ({
        activeBoard:
          state.activeBoard?._id === boardId
            ? { ...state.activeBoard, ...updatedBoard }
            : state.activeBoard,
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to add member", loading: false });
      throw error;
    }
  },

  leaveBoard: async (boardId: string) => {
    const previousBoards = get().boards;
    const previousActiveBoard = get().activeBoard;

    try {
      // Optimistic update
      set((state) => ({
        boards: state.boards.filter((board) => board._id !== boardId),
        activeBoard:
          state.activeBoard?._id === boardId ? null : state.activeBoard,
      }));

      // API call
      await boardService.leaveBoard(boardId);

      // Refresh boards after successful leave
      await get().fetchBoards();
    } catch (error: any) {
      // Revert optimistic update if there's an error
      set({
        boards: previousBoards,
        activeBoard: previousActiveBoard,
        error: error.response?.data?.message || "Failed to leave board",
      });
      throw error;
    }
  },

  setActiveBoard: (board) => {
    set({ activeBoard: board });
  },

  // Column Actions - These remain mostly the same but now work with activeBoard
  addColumn: async (boardId: string, data: CreateColumnInput) => {
    try {
      const columnRequest: any = {
        ...data,
        boardId,
      };

      const newColumn = await columnService.createColumn(
        boardId,
        columnRequest
      );

      // State güncelleme
      set((state: any) => {
        if (state.activeBoard && state.activeBoard._id === boardId) {
          // Tam kolon objesi oluştur
          const fullColumn = {
            _id: newColumn._id,
            name: newColumn.name,
            type: newColumn.type,
            order: state.activeBoard.columns.length,
            isDefault: false,
            color: newColumn.color || "#E2E8F0",
            limit: newColumn.limit,
            tasks: [],
            boardId: boardId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            ...state,
            activeBoard: {
              ...state.activeBoard,
              columns: [...state.activeBoard.columns, fullColumn],
            },
          };
        }
        return state;
      });
    } catch (error) {
      console.error("Error adding column:", error);
      throw error;
    }
  },

  updateColumn: async (boardId, columnId, data) => {
    try {
      const updatedColumn = await columnService.updateColumn(
        boardId,
        columnId,
        data
      );
      set((state: any) => {
        if (state.activeBoard && state.activeBoard._id === boardId) {
          return {
            ...state,
            activeBoard: {
              ...state.activeBoard,
              columns: state.activeBoard.columns.map((col: any) =>
                col._id === columnId ? { ...col, ...updatedColumn } : col
              ),
            },
          };
        }
        return state;
      });
    } catch (error) {
      throw error;
    }
  },

  deleteColumn: async (boardId, columnId) => {
    try {
      await columnService.deleteColumn(boardId, columnId);
      set((state) => {
        if (state.activeBoard && state.activeBoard._id === boardId) {
          return {
            ...state,
            activeBoard: {
              ...state.activeBoard,
              columns: state.activeBoard.columns.filter(
                (col) => col._id !== columnId
              ),
            },
          };
        }
        return state;
      });
    } catch (error) {
      throw error;
    }
  },

  updateColumnOrder: async (boardId, columnId, newOrder) => {
    try {
      set((state) => {
        if (state.activeBoard && state.activeBoard._id === boardId) {
          const columns = [...state.activeBoard.columns];
          const oldIndex = columns.findIndex((col) => col._id === columnId);
          if (oldIndex === -1) return state;

          // Sütunu taşı
          const [movedColumn] = columns.splice(oldIndex, 1);
          columns.splice(newOrder, 0, movedColumn);

          // Sıralamayı güncelle (order property)
          const updatedColumns = columns.map((col, index) => ({
            ...col,
            order: index, // Sütunların order değerini index ile eşle
          }));

          // State'i güncelle
          return {
            ...state,
            activeBoard: {
              ...state.activeBoard,
              columns: updatedColumns,
            },
          };
        }
        return state;
      });

      // API'ye yeni sıralamayı gönder
      await columnService.updateColumnOrder(boardId, columnId, newOrder);
    } catch (error) {
      // Hata durumunda state'i geri al
      const originalState = get();
      set(originalState);
      throw error;
    }
  },

  createTask: async (
    boardId: string,
    columnId: string,
    data: CreateTaskInput
  ) => {
    const currentState = get();
    const currentBoard = currentState.activeBoard;
    if (!currentBoard) return;
    try {
      set({ loading: true });

      // API çağrısı - artık dönüşüme gerek yok çünkü tip zaten string
      const newTask = await taskService.createTask(boardId, columnId, data);

      // State güncelleme
      set((state: BoardState) => {
        const activeBoard = state.activeBoard;
        if (!activeBoard) return state;
        const updatedColumns = activeBoard.columns.map((column: Column) => {
          if (column._id === columnId) {
            return {
              ...column,
              tasks: [...column.tasks, newTask],
            };
          }
          return column;
        });
        return {
          ...state,
          activeBoard: {
            ...activeBoard,
            columns: updatedColumns,
          },
        };
      });
    } catch (error) {
      console.error("Task oluşturma hatası:", error);
      set((state: BoardState) => ({
        ...state,
        error: "Failed to create task",
      }));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteTask: async (boardId: string, taskId: string) => {
    const currentState = get();
    const currentBoard = currentState.activeBoard;

    if (!currentBoard || currentBoard._id !== boardId) return;

    try {
      set({ loading: true });

      // Optimistic update
      set((state: BoardState) => {
        if (!state.activeBoard || state.activeBoard._id !== boardId)
          return state;

        const updatedColumns = state.activeBoard.columns.map(
          (column: Column) => ({
            ...column,
            tasks: column.tasks
              .filter((task: Task) => task._id !== taskId)
              .map((task, index) => ({ ...task, order: index })),
          })
        );

        return {
          ...state,
          activeBoard: {
            ...state.activeBoard,
            columns: updatedColumns,
          },
        };
      });

      await taskService.deleteTask(boardId, taskId);
    } catch (error) {
      // Hata durumunda geri al
      set((state: BoardState) => ({
        ...state,
        activeBoard: currentState.activeBoard,
        error: "Failed to delete task",
      }));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (
    boardId: string,
    taskId: string,
    data: UpdateTaskInput
  ) => {
    const currentState = get();
    const currentBoard = currentState.boards.find(
      (b: Board) => b._id === boardId
    );
    if (!currentBoard) return;
    try {
      set({ loading: true });

      // API çağrısı - artık dönüşüme gerek yok
      await taskService.updateTask(boardId, taskId, data);

      // Optimistic update
      set((state: any) => {
        const updatedBoards = state.boards.map((board: Board) => {
          if (board._id !== boardId) return board;
          const updatedColumns = board.columns.map((column: Column) => {
            return {
              ...column,
              tasks: column.tasks.map((task: Task) => {
                if (task._id === taskId) {
                  return {
                    ...task,
                    ...data,
                  };
                }
                return task;
              }),
            };
          });
          return {
            ...board,
            columns: updatedColumns,
          };
        });
        return {
          ...state,
          boards: updatedBoards,
          activeBoard:
            updatedBoards.find((b: Board) => b._id === boardId) ||
            state.activeBoard,
        };
      });
    } catch (error) {
      // Hata durumunda original state'e dön
      set((state: BoardState) => ({
        ...state,
        boards: currentState.boards,
        activeBoard: currentState.activeBoard,
        error: "Failed to update task",
      }));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  moveTask: async (boardId: string, taskId: string, data: MoveTaskInput) => {
    const currentState = get();
    const currentBoard = currentState.activeBoard;

    if (!currentBoard) return;

    try {
      set({ loading: true });

      set((state: BoardState) => {
        const activeBoard = state.activeBoard;
        if (!activeBoard) return state;

        // Önce taşınacak task'ı bul
        let taskToMove: Task | null = null;
        activeBoard.columns.forEach((col) => {
          const foundTask = col.tasks.find((t) => t._id === taskId);
          if (foundTask) {
            taskToMove = {
              ...foundTask,
              columnId: data.targetColumnId,
            };
          }
        });

        if (!taskToMove) return state;

        // Mevcut kolon sıralamasını ve özelliklerini koru
        const updatedColumns = activeBoard.columns.map((column: Column) => {
          // Hedef kolona task ekleme
          if (column._id === data.targetColumnId) {
            let existingTasks = [...column.tasks];

            // Önce aynı task varsa kaldır (aynı kolon içi taşıma durumu için)
            existingTasks = existingTasks.filter((t) => t._id !== taskId);

            // Task'ı hedef pozisyona ekle
            existingTasks.splice(data.order, 0, taskToMove as Task); // Type assertion ekledik

            return {
              ...column,
              tasks: existingTasks.map((task, index) => ({
                ...task,
                order: index,
              })),
            };
          }

          // Diğer kolonlardan task'ı kaldır
          return {
            ...column,
            tasks: column.tasks
              .filter((task) => task._id !== taskId)
              .map((task, index) => ({
                ...task,
                order: index,
              })),
          };
        });

        // Board'u güncelle ama kolon sıralamasını koru
        return {
          ...state,
          activeBoard: {
            ...activeBoard,
            columns: updatedColumns,
          },
        };
      });

      // API'ye görev taşıma isteği gönder
      await taskService.moveTask(
        boardId,
        taskId,
        data.targetColumnId,
        data.order
      );
    } catch (error) {
      // Hata durumunda state'i geri al
      set((state: BoardState) => ({
        ...state,
        boards: currentState.boards,
        activeBoard: currentState.activeBoard,
        error: "Failed to move task",
      }));
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  reset: () => {
    set({
      boards: [],
      activeBoard: null,
      loading: false,
      initialized: false,
      error: null,
    });
  },
}));
