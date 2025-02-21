// src/lib/services/notification-service.ts
import axios from "@/lib/utils/axios";
import {
  Notification,
  NotificationResponse,
  NotificationFilters,
} from "@/lib/types/notification";

export const notificationService = {
  getNotifications: async (
    filters?: NotificationFilters
  ): Promise<NotificationResponse> => {
    const response = await axios.get("/api/notifications", { params: filters });
    return response.data;
  },

  // Okunmamış bildirim sayısı
  getUnreadCount: async (): Promise<number> => {
    const response = await axios.get("/api/notifications/unread-count");
    return response.data.count;
  },

  // Bildirimi okundu olarak işaretle
  acceptInvitation: async (notificationId: string): Promise<void> => {
    await axios.post(`/api/boards/invitations/${notificationId}/respond`, {
      accept: true,
    });
  },

  rejectInvitation: async (notificationId: string): Promise<void> => {
    await axios.post(`/api/boards/invitations/${notificationId}/respond`, {
      accept: false,
    });
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await axios.patch(
      `/api/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Tüm bildirimleri okundu olarak işaretle
  markAllAsRead: async (): Promise<void> => {
    await axios.patch("/api/notifications/mark-all-read");
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await axios.delete(`/api/notifications/${notificationId}`);
  },
};
