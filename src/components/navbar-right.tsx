"use client";

import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";
import { NotificationArea } from "@/components/layout/notification-area";

export function NavbarRight() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="ml-auto flex items-center space-x-4">
      <ThemeToggle />
      {isAuthenticated && <NotificationArea />}
      <UserMenu />
    </div>
  );
}
