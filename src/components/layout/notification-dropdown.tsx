// src/components/layout/notification-dropdown.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { Loader2, Bell, Check } from "lucide-react";
import { useNotificationStore } from "@/store/notification-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NotificationItem } from "./notification-item";

export function NotificationDropdown() {
  const {
    notifications,
    loading,
    hasMore,
    fetchNotifications,
    markAllAsRead,
    resetStore,
  } = useNotificationStore();
  const { toast } = useToast();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastNotificationRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNotifications();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore, fetchNotifications]
  );

  useEffect(() => {
    resetStore();
    fetchNotifications();
  }, [fetchNotifications, resetStore]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notifications as read",
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <div>
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              {notifications.length} notifications
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={handleMarkAllAsRead}
        >
          <Check className="h-4 w-4 mr-1" />
          Mark all read
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        {notifications.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification, index) => {
              const isLastElement = index === notifications.length - 1;
              return (
                <div
                  key={notification._id}
                  ref={isLastElement ? lastNotificationRef : null}
                >
                  <NotificationItem notification={notification} />
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
