// src/components/board/avatar-group.tsx
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AvatarGroupProps {
  users: User[];
  maxCount?: number;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AvatarGroup({
  users,
  maxCount = 5,
  className,
}: AvatarGroupProps) {
  const visibleUsers = users.slice(0, maxCount);
  const remainingCount = users.length - maxCount;

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex -space-x-2 hover:space-x-1 transition-all duration-200",
          className
        )}
      >
        {visibleUsers.map((user) => (
          <Tooltip key={user._id}>
            <TooltipTrigger asChild>
              <Avatar className="ring-2 ring-background hover:ring-primary/10 hover:translate-y-0.5 transition-all duration-200">
                <AvatarFallback className="bg-gradient-to-br from-primary/50 to-primary text-primary-foreground font-medium">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={4}
              className="bg-popover text-popover-foreground shadow-md"
            >
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="ring-2 ring-background hover:ring-primary/10 bg-muted hover:translate-y-0.5 transition-all duration-200">
                <AvatarFallback className="font-medium">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent
              className="bg-popover text-popover-foreground shadow-md"
              sideOffset={4}
            >
              <p className="font-medium text-foreground mb-2">Other Members</p>
              <div className="space-y-2">
                {users.slice(maxCount).map((user) => (
                  <div key={user._id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                    <span className="text-sm text-foreground">{user.name}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
