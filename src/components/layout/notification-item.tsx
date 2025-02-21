// src/components/layout/notification-item.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notification-store";
import { Notification, NotificationType } from "@/lib/types/notification";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AnswerMemberModal } from "@/components/modals/answer-member-modal";
import { ReactElement } from "react";

interface NotificationItemProps {
  notification: Notification;
}

const NOTIFICATION_ICONS: Record<NotificationType, ReactElement> = {
  BOARD_INVITATION: <div className="h-2 w-2 rounded-full bg-blue-500" />,
  BOARD_DELETED: <div className="h-2 w-2 rounded-full bg-red-500" />,
  MEMBER_ADDED: <div className="h-2 w-2 rounded-full bg-green-500" />,
  MEMBER_LEFT: <div className="h-2 w-2 rounded-full bg-yellow-500" />,
  MEMBER_REMOVED: <div className="h-2 w-2 rounded-full bg-orange-500" />,
  BOARD_UPDATED: <div className="h-2 w-2 rounded-full bg-purple-500" />,
};

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { markAsRead, deleteNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      if (!notification.isRead) {
        await markAsRead(notification._id);
      }

      if (notification.type === "BOARD_INVITATION") {
        setIsModalOpen(true);
      } else if (notification.data?.boardId) {
        router.push(`/boards/${notification.data.boardId}`);
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process notification",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await deleteNotification(notification._id);
      toast({ title: "Success", description: "Notification deleted" });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete notification",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={cn(
          "flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer relative group",
          !notification.isRead && "bg-muted/30"
        )}
      >
        <div className="flex-shrink-0 mt-1">
          {NOTIFICATION_ICONS[notification.type]}
        </div>
        <div className="flex-grow min-w-0">
          <p className={cn("text-sm", !notification.isRead && "font-medium")}>
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(notification.createdAt), "MMM d, h:mm a")}
          </p>
        </div>
        {isLoading ? (
          <div className="flex-shrink-0">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        )}
      </div>

      {notification.type === "BOARD_INVITATION" && isModalOpen && (
        <AnswerMemberModal
          invitation={notification}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
