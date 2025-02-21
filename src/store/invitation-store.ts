// src/store/invitation-store.ts
import { create } from "zustand";
import axios from "@/lib/utils/axios";
import { Invitation } from "@/lib/types/invitation";

interface InvitationState {
  invitations: Invitation[];
  receivedInvitations: Invitation[];
  sentInvitations: Invitation[];
  loading: boolean;
  error: string | null;
  fetchInvitations: () => Promise<void>;
  acceptInvitation: (id: string) => Promise<void>;
  rejectInvitation: (id: string) => Promise<void>;
}

export const useInvitationStore = create<InvitationState>((set, get) => ({
  invitations: [],
  receivedInvitations: [],
  sentInvitations: [],
  loading: false,
  error: null,

  fetchInvitations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get("/api/boards/invitations/received");
      const receivedInvitations = response.data || [];
      set({
        receivedInvitations,
        invitations: receivedInvitations,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch invitations",
        loading: false,
      });
    }
  },

  acceptInvitation: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.post(`/api/boards/invitations/${id}/respond`, {
        accept: true,
      });

      // Kabul edilen daveti yerel state'den kaldır
      const updatedInvitations = get().receivedInvitations.filter(
        (inv) => inv._id !== id
      );

      set({
        receivedInvitations: updatedInvitations,
        invitations: updatedInvitations,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to accept invitation",
        loading: false,
      });
      throw error;
    }
  },

  rejectInvitation: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.post(`/api/boards/invitations/${id}/respond`, {
        accept: false,
      });

      // Reddedilen daveti yerel state'den kaldır
      const updatedInvitations = get().receivedInvitations.filter(
        (inv) => inv._id !== id
      );

      set({
        receivedInvitations: updatedInvitations,
        invitations: updatedInvitations,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to reject invitation",
        loading: false,
      });
      throw error;
    }
  },
}));
