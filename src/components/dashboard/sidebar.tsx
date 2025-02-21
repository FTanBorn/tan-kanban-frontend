// src/components/dashboard/sidebar.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LayoutDashboard, Crown, Folder, Users2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoardStore } from "@/store/board-store";
import { CreateBoardModal } from "@/components/modals/create-board-modal";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { boards, loading, initialized, fetchBoards } = useBoardStore();

  useEffect(() => {
    if (!initialized) {
      fetchBoards();
    }
  }, [initialized, fetchBoards]);

  // Yükleme durumu için iskelet
  if (!initialized && loading) {
    return (
      <div className="border-r bg-muted/30 h-full w-64 flex flex-col p-4">
        <Skeleton className="h-10 w-full mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Board grupları
  const ownedBoards = boards.filter(
    (board) => board.owner?._id === session?.user?.id
  );
  const sharedBoards = boards.filter(
    (board) => board.owner?._id !== session?.user?.id
  );

  return (
    <div className="border-r bg-muted/30 h-full w-64 flex flex-col">
      {/* Dashboard Linki */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          asChild
          className={cn(
            "w-full justify-start gap-2 font-medium",
            pathname === "/dashboard" && "bg-accent"
          )}
        >
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </Link>
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-6 py-4">
          {/* Kişisel Boardlar */}
          <div>
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Crown className="h-4 w-4 text-amber-500" />
                <span>YOUR BOARDS</span>
              </div>
              <CreateBoardModal>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Plus className="h-4 w-4" />
                </Button>
              </CreateBoardModal>
            </div>
            <div className="space-y-1">
              {ownedBoards.map((board) => (
                <Button
                  key={board._id}
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start gap-2 pl-8 relative group hover:bg-accent/50",
                    pathname === `/boards/${board._id}` && "bg-accent"
                  )}
                >
                  <Link href={`/boards/${board._id}`}>
                    <Folder
                      className={cn(
                        "h-4 w-4 absolute left-2 text-muted-foreground/60 group-hover:text-muted-foreground",
                        pathname === `/boards/${board._id}` && "text-foreground"
                      )}
                    />
                    <span className="truncate">{board.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Paylaşılan Boardlar */}
          {sharedBoards.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-2">
                <Users2 className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  SHARED BOARDS
                </span>
              </div>
              <div className="space-y-1">
                {sharedBoards.map((board) => (
                  <Button
                    key={board._id}
                    variant="ghost"
                    asChild
                    className={cn(
                      "w-full justify-start gap-2 pl-8 relative group hover:bg-accent/50",
                      pathname === `/boards/${board._id}` && "bg-accent"
                    )}
                  >
                    <Link href={`/boards/${board._id}`}>
                      <Folder
                        className={cn(
                          "h-4 w-4 absolute left-2 text-muted-foreground/60 group-hover:text-muted-foreground",
                          pathname === `/boards/${board._id}` &&
                            "text-foreground"
                        )}
                      />
                      <span className="truncate">{board.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
