// src/lib/types/notification.ts

export type NotificationType =
  | "BOARD_INVITATION"
  | "BOARD_DELETED"
  | "MEMBER_ADDED"
  | "MEMBER_LEFT"
  | "MEMBER_REMOVED"
  | "BOARD_UPDATED";

export type NotificationPriority = "HIGH" | "MEDIUM" | "LOW";

export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  data?: {
    boardId?: string;
    boardName?: string;
    userId?: string;
    userName?: string;
  };
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  page?: number;
  limit?: number;
}

export interface UnreadCountResponse {
  count: number;
}
