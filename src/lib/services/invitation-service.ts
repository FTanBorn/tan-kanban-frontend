// src/lib/services/invitation-service.ts
import axios from "@/lib/utils/axios";
import { Invitation, InvitationResponse } from "@/lib/types/invitation";

export const invitationService = {
  getInvitations: async (): Promise<Invitation[]> => {
    const response = await axios.get("/api/invitations");
    return response.data;
  },

  // Davete yanıt ver
  respondToInvitation: async (
    invitationId: string,
    accept: boolean
  ): Promise<InvitationResponse> => {
    const response = await axios.post(
      `/api/invitations/${invitationId}/respond`,
      { accept }
    );
    return response.data;
  },

  // Board'dan çık
};
