// src/lib/services/task-service.ts
import axios from "@/lib/utils/axios";
import { Task } from "../types/task";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const taskService = {
  // Task CRUD Operations
  createTask: async (
    boardId: string,
    columnId: string,
    data: any
  ): Promise<Task> => {
    const response = await axios.post<ApiResponse<Task>>(
      `/api/boards/${boardId}/columns/${columnId}/tasks`,
      data
    );
    return response.data.data;
  },

  getTasks: async (boardId: string, columnId: string): Promise<Task[]> => {
    const response = await axios.get<ApiResponse<Task[]>>(
      `/api/boards/${boardId}/columns/${columnId}/tasks`
    );
    return response.data.data;
  },

  getTaskById: async (boardId: string, taskId: string): Promise<Task> => {
    const response = await axios.get<ApiResponse<Task>>(
      `/api/boards/${boardId}/tasks/${taskId}`
    );
    return response.data.data;
  },

  updateTask: async (
    boardId: string,
    taskId: string,
    data: any
  ): Promise<Task> => {
    const response = await axios.put<ApiResponse<Task>>(
      `/api/boards/${boardId}/tasks/${taskId}`,
      data
    );
    return response.data.data;
  },

  deleteTask: async (boardId: string, taskId: string): Promise<void> => {
    const response = await axios.delete<ApiResponse<void>>(
      `/api/boards/${boardId}/tasks/${taskId}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete task");
    }
  },

  // Task Movement
  moveTask: async (
    boardId: string,
    taskId: string,
    targetColumnId: string,
    order: number
  ): Promise<Task> => {
    const response = await axios.put<{ data: Task }>(
      `/api/boards/${boardId}/tasks/${taskId}/move`,
      {
        targetColumnId,
        order,
      }
    );

    return response.data.data;
  },

  // Comment Management
  addComment: async (
    boardId: string,
    taskId: string,
    content: string
  ): Promise<Task> => {
    const response = await axios.post<ApiResponse<Task>>(
      `/api/boards/${boardId}/tasks/${taskId}/comments`,
      { content }
    );
    return response.data.data;
  },

  updateComment: async (
    boardId: string,
    taskId: string,
    commentId: string,
    content: string
  ): Promise<Task> => {
    const response = await axios.put<ApiResponse<Task>>(
      `/api/boards/${boardId}/tasks/${taskId}/comments/${commentId}`,
      { content }
    );
    return response.data.data;
  },

  deleteComment: async (
    boardId: string,
    taskId: string,
    commentId: string
  ): Promise<void> => {
    const response = await axios.delete<ApiResponse<void>>(
      `/api/boards/${boardId}/tasks/${taskId}/comments/${commentId}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete comment");
    }
  },

  // Task Assignment
  assignUser: async (
    boardId: string,
    taskId: string,
    userId: string
  ): Promise<Task> => {
    const response = await axios.post<ApiResponse<Task>>(
      `/api/boards/${boardId}/tasks/${taskId}/assign/${userId}`
    );
    return response.data.data;
  },

  unassignUser: async (
    boardId: string,
    taskId: string,
    userId: string
  ): Promise<Task> => {
    const response = await axios.delete<ApiResponse<Task>>(
      `/api/boards/${boardId}/tasks/${taskId}/assign/${userId}`
    );
    return response.data.data;
  },
};
