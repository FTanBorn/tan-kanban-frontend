// src/components/layout/notification-area.tsx
"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { useNotificationStore } from "@/store/notification-store";
import { useEffect } from "react";
import { NotificationDropdown } from "./notification-dropdown";

export function NotificationArea() {
  const { status } = useSession();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    // Only fetch if user is authenticated
    if (status === "authenticated") {
      fetchUnreadCount();
      // Polling for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchUnreadCount, status]);

  // Don't render anything if not authenticated
  if (status !== "authenticated") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
