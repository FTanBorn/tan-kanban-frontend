// src/store/task-store.ts
import { create } from "zustand";
import { taskService } from "@/lib/services/task-service";
import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  MoveTaskInput,
} from "@/lib/types/task";

interface TaskState {
  tasks: { [columnId: string]: Task[] };
  activeTask: Task | null;
  loading: boolean;
  error: string | null;

  // Task CRUD Operations
  fetchTasks: (boardId: string, columnId: string) => Promise<void>;
  fetchTaskDetails: (boardId: string, taskId: string) => Promise<void>;
  createTask: (
    boardId: string,
    columnId: string,
    data: CreateTaskInput
  ) => Promise<Task>;
  updateTask: (
    boardId: string,
    taskId: string,
    data: UpdateTaskInput
  ) => Promise<void>;
  deleteTask: (boardId: string, taskId: string) => Promise<void>;

  // Task Management
  moveTask: (
    boardId: string,
    taskId: string,
    moveData: MoveTaskInput
  ) => Promise<void>;

  // Comments
  addComment: (
    boardId: string,
    taskId: string,
    content: string
  ) => Promise<void>;
  updateComment: (
    boardId: string,
    taskId: string,
    commentId: string,
    content: string
  ) => Promise<void>;
  deleteComment: (
    boardId: string,
    taskId: string,
    commentId: string
  ) => Promise<void>;

  // State Management
  setActiveTask: (task: Task | null) => void;
  clearTasks: () => void;
  updateLocalTask: (
    columnId: string,
    taskId: string,
    updates: Partial<Task>
  ) => void;
  removeLocalTask: (columnId: string, taskId: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: {},
  activeTask: null,
  loading: false,
  error: null,

  fetchTasks: async (boardId: string, columnId: string) => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskService.getTasks(boardId, columnId);
      set((state) => ({
        tasks: {
          ...state.tasks,
          [columnId]: tasks,
        },
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch tasks";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  fetchTaskDetails: async (boardId: string, taskId: string) => {
    set({ loading: true, error: null });
    try {
      const task = await taskService.getTaskById(boardId, taskId);
      set({ activeTask: task, loading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch task details";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  createTask: async (
    boardId: string,
    columnId: string,
    data: CreateTaskInput
  ) => {
    set({ loading: true, error: null });
    try {
      const newTask = await taskService.createTask(boardId, columnId, data);
      set((state) => ({
        tasks: {
          ...state.tasks,
          [columnId]: [...(state.tasks[columnId] || []), newTask],
        },
        loading: false,
      }));
      return newTask;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create task";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateTask: async (
    boardId: string,
    taskId: string,
    data: UpdateTaskInput
  ) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await taskService.updateTask(boardId, taskId, data);
      set((state) => {
        const columnId = updatedTask.column;
        return {
          tasks: {
            ...state.tasks,
            [columnId]: state.tasks[columnId].map((task) =>
              task._id === taskId ? updatedTask : task
            ),
          },
          activeTask:
            state.activeTask?._id === taskId ? updatedTask : state.activeTask,
          loading: false,
        };
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update task";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteTask: async (boardId: string, taskId: string) => {
    set({ loading: true, error: null });
    try {
      await taskService.deleteTask(boardId, taskId);
      set((state) => {
        const columnId = Object.keys(state.tasks).find((colId) =>
          state.tasks[colId].some((task) => task._id === taskId)
        );

        if (!columnId) return state;

        return {
          tasks: {
            ...state.tasks,
            [columnId]: state.tasks[columnId].filter(
              (task) => task._id !== taskId
            ),
          },
          activeTask:
            state.activeTask?._id === taskId ? null : state.activeTask,
          loading: false,
        };
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete task";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  moveTask: async (
    boardId: string,
    taskId: string,
    moveData: MoveTaskInput
  ) => {
    const { targetColumnId, order } = moveData;

    set({ loading: true, error: null });

    // Optimistik güncelleme için mevcut durumu kaydedelim
    const currentState = get().tasks;

    try {
      // Task'ın hangi kolonda olduğunu bulalım
      const sourceColumnId = Object.keys(currentState).find((columnId) =>
        currentState[columnId].some((task) => task._id === taskId)
      );

      if (!sourceColumnId) {
        throw new Error("Source task not found");
      }

      const taskToMove = currentState[sourceColumnId].find(
        (task) => task._id === taskId
      );

      if (!taskToMove) {
        throw new Error("Task not found");
      }

      // Optimistik güncelleme yapalım
      set((state) => ({
        tasks: {
          ...state.tasks,
          // Eski kolondan task'ı çıkar
          [sourceColumnId]: state.tasks[sourceColumnId].filter(
            (task) => task._id !== taskId
          ),
          // Yeni kolona task'ı ekle
          [targetColumnId]: [
            ...(state.tasks[targetColumnId] || []),
            { ...taskToMove, column: targetColumnId, order },
          ].sort((a, b) => a.order - b.order),
        },
        loading: false,
      }));

      // Backend'e isteği gönder ve güncellenmiş task'ı al
      const updatedTask = await taskService.moveTask(
        boardId,
        taskId,
        targetColumnId,
        order
      );

      // API'den dönen güncellenmiş task ile state'i güncelle
      set((state) => ({
        tasks: {
          ...state.tasks,
          [targetColumnId]: state.tasks[targetColumnId].map((task) =>
            task._id === taskId ? updatedTask : task
          ),
        },
      }));
    } catch (error: any) {
      console.error("Error moving task:", error);

      // Hata durumunda optimistik güncellemeyi geri al
      set({
        tasks: currentState,
        loading: false,
        error: error.message || "Failed to move task",
      });

      throw error;
    }
  },

  addComment: async (boardId: string, taskId: string, content: string) => {
    try {
      const updatedTask = await taskService.addComment(
        boardId,
        taskId,
        content
      );
      set((state) => ({
        activeTask:
          state.activeTask?._id === taskId ? updatedTask : state.activeTask,
      }));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add comment";
      throw new Error(errorMessage);
    }
  },

  updateComment: async (
    boardId: string,
    taskId: string,
    commentId: string,
    content: string
  ) => {
    try {
      const updatedTask = await taskService.updateComment(
        boardId,
        taskId,
        commentId,
        content
      );
      set((state) => ({
        activeTask:
          state.activeTask?._id === taskId ? updatedTask : state.activeTask,
      }));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update comment";
      throw new Error(errorMessage);
    }
  },

  deleteComment: async (boardId: string, taskId: string, commentId: string) => {
    try {
      const updatedTask = await taskService.deleteComment(
        boardId,
        taskId,
        commentId
      );
      set((state: any) => ({
        activeTask:
          state.activeTask?._id === taskId ? updatedTask : state.activeTask,
      }));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete comment";
      throw new Error(errorMessage);
    }
  },

  setActiveTask: (task) => set({ activeTask: task }),
  clearTasks: () => set({ tasks: {}, activeTask: null }),

  updateLocalTask: (columnId, taskId, updates) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [columnId]: state.tasks[columnId].map((task) =>
          task._id === taskId ? { ...task, ...updates } : task
        ),
      },
    })),

  removeLocalTask: (columnId, taskId) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [columnId]: state.tasks[columnId].filter((task) => task._id !== taskId),
      },
    })),
}));
