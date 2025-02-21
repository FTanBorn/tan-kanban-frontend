// src/lib/services/board-service.ts
import axios from "@/lib/utils/axios";
import { Board, CreateBoardInput, SimpleBoard } from "@/lib/types/board";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/auth";

export const boardService = {
  // Basit board listesini getir
  getBoardsSimple: async (): Promise<SimpleBoard[]> => {
    const response = await axios.get("/api/boards/simple");
    return response.data;
  },

  getBoards: async (): Promise<Board[]> => {
    const response = await axios.get("/api/boards");
    return response.data;
  },

  // Detaylı board getir
  getBoardDetails: async (id: string): Promise<Board> => {
    const response = await axios.get(`/api/boards/${id}`);
    return response.data;
  },

  // Server side board detayı getir
  getBoardDetailsServer: async (id: string): Promise<Board> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.token) {
      throw new Error("Unauthorized");
    }

    const response = await axios.get(`/api/boards/${id}`, {
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    return response.data;
  },

  // Yeni board oluştur
  createBoard: async (data: CreateBoardInput): Promise<Board> => {
    const response = await axios.post("/api/boards", data);
    return response.data;
  },

  // Board güncelle
  updateBoard: async (
    id: string,
    data: Partial<CreateBoardInput>
  ): Promise<Board> => {
    const response = await axios.put(`/api/boards/${id}`, data);
    return response.data;
  },

  // Board sil
  deleteBoard: async (id: string): Promise<void> => {
    await axios.delete(`/api/boards/${id}`);
  },

  // Üye ekleme
  addMember: async (boardId: string, email: string): Promise<Board> => {
    const response = await axios.post(`/api/boards/${boardId}/members`, {
      email,
    });
    return response.data;
  },

  leaveBoard: async (boardId: string): Promise<void> => {
    await axios.post(`/api/boards/${boardId}/leave`);
  },

  removeMember: async (boardId: string, memberId: string): Promise<void> => {
    await axios.delete(`/api/boards/${boardId}/members/${memberId}`);
  },
};
