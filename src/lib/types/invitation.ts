// src/lib/types/invitation.ts
export interface Invitation {
  _id: string;
  board: {
    _id: string;
    name: string;
    description?: string;
  };
  invitedBy: {
    _id: string;
    name: string;
    email: string;
  };
  invitedUser?: {
    _id: string;
    name: string;
    email: string;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface InvitationResponse {
  message: string;
  invitation?: Invitation;
  board?: {
    _id: string;
    name: string;
    description: string;
    members: string[];
    owner: string;
  };
}
