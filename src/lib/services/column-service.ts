// src/lib/services/column-service.ts
import axios from "@/lib/utils/axios";
import {
  Column,
  CreateColumnInput,
  UpdateColumnInput,
} from "@/lib/types/column";

export const columnService = {
  // Kolon oluştur
  createColumn: async (
    boardId: string,
    data: CreateColumnInput
  ): Promise<Column> => {
    const response = await axios.post(`/api/boards/${boardId}/columns`, data);
    return response.data;
  },

  // Kolon güncelle
  updateColumn: async (
    boardId: string,
    columnId: string,
    data: UpdateColumnInput
  ): Promise<Column> => {
    const response = await axios.put(
      `/api/boards/${boardId}/columns/${columnId}`,
      data
    );
    return response.data;
  },

  // Kolon sil
  deleteColumn: async (boardId: string, columnId: string): Promise<void> => {
    await axios.delete(`/api/boards/${boardId}/columns/${columnId}`);
  },

  // Kolon sıralaması güncelle
  updateColumnOrder: async (
    boardId: string,
    columnId: string,
    newOrder: number
  ): Promise<void> => {
    await axios.put(`/api/boards/${boardId}/columns/reorder`, {
      columnId,
      newOrder,
    });
  },
};
