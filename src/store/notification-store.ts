// src/store/notification-store.ts
import { create } from "zustand";
import { notificationService } from "@/lib/services/notification-service";
import { Notification, NotificationFilters } from "@/lib/types/notification";
import { getSession } from "next-auth/react";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  // Actions
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  resetStore: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,

  fetchNotifications: async (filters?: NotificationFilters) => {
    const session = await getSession();
    if (!session?.user) return;

    try {
      set({ loading: true, error: null });
      const { notifications, pagination } =
        await notificationService.getNotifications({
          page: get().currentPage,
          limit: 10,
          ...filters,
        });

      set((state) => ({
        notifications:
          state.currentPage === 1
            ? notifications
            : [
                ...new Map(
                  [...state.notifications, ...notifications].map((item) => [
                    item._id,
                    item,
                  ])
                ).values(),
              ],
        hasMore: get().currentPage < pagination.pages,
        currentPage: get().currentPage + 1,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch notifications",
        loading: false,
      });
    }
  },

  fetchUnreadCount: async () => {
    const session = await getSession();
    if (!session?.user) return;

    try {
      const count = await notificationService.getUnreadCount();
      set({ unreadCount: count });
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const updatedNotification = await notificationService.markAsRead(
        notificationId
      );
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification._id === notificationId
            ? updatedNotification
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to mark as read" });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: new Date().toISOString(),
        })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to mark all as read",
      });
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification._id !== notificationId
        ),
        unreadCount:
          state.unreadCount -
          (state.notifications.find(
            (n) => n._id === notificationId && !n.isRead
          )
            ? 1
            : 0),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete notification",
      });
    }
  },

  resetStore: () => {
    set({
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
      hasMore: true,
      currentPage: 1,
    });
  },
}));
