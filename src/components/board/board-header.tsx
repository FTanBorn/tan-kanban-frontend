// src/components/board/board-header.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus,
  UserPlus,
  MoreVertical,
  Pencil,
  Trash2,
  Layout,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { EditBoardModal } from "../modals/edit-board-modal";
import { DeleteBoardDialog } from "../modals/delete-board-dialog";
import { InviteMemberModal } from "../modals/invite-member-modal";
import { ManageMembersModal } from "../modals/manage-members-modal";
import { LeaveBoardDialog } from "../modals/leave-board-dialog";
import { useBoardStore } from "@/store/board-store";
import { useToast } from "@/hooks/use-toast";
import { AvatarGroup } from "./avatar-group";
import { Board } from "@/lib/types/board";
import { AddColumnModal } from "./add-column-modal";

interface BoardHeaderProps {
  board: Board;
}

export function BoardHeader({ board }: BoardHeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { status, data: session } = useSession();
  const { deleteBoard, updateBoard } = useBoardStore();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const isOwner = session?.user?.id === board.owner?._id;

  const handleDeleteBoard = async () => {
    try {
      setIsDeleteLoading(true);
      await deleteBoard(board._id);
      toast({
        title: "Success",
        description: "Board has been deleted",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete board",
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleUpdateBoard = async (data: Partial<Board>) => {
    try {
      await updateBoard(board._id, data);
      toast({
        title: "Success",
        description: "Board has been updated",
      });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update board",
      });
    }
  };

  const allUsers = [
    ...(board.members || []).map((member: any) => ({
      _id: member._id,
      name: member.name,
      email: member.email,
    })),
  ];

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Sol Kısım: Başlık ve Açıklama */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Layout className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="flex items-center gap-2 group">
                <h1 className="text-lg font-semibold tracking-tight">
                  {board.name}
                </h1>
                {isOwner && (
                  <EditBoardModal
                    board={board}
                    onSubmitAction={handleUpdateBoard}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </EditBoardModal>
                )}
              </div>
              {board.description && (
                <p className="text-sm text-muted-foreground">
                  {board.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sağ Kısım: Üyeler ve Butonlar */}
        <div className="flex items-center gap-6">
          {/* Üyeler */}
          <div className="flex items-center gap-3">
            <AvatarGroup users={allUsers} maxCount={5} />
            <span className="text-sm text-muted-foreground">
              {allUsers.length} {allUsers.length === 1 ? "member" : "members"}
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Butonlar */}
          <div className="flex items-center gap-2">
            {isOwner ? (
              <InviteMemberModal boardId={board._id} onSuccess={() => {}}>
                <Button variant="outline" size="sm" className="h-8">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </InviteMemberModal>
            ) : (
              <LeaveBoardDialog boardId={board._id} />
            )}

            <AddColumnModal
              boardId={board._id}
              onSuccess={() => router.refresh()}
            >
              <Button size="sm" className="h-8">
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </AddColumnModal>

            {status === "authenticated" && isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <ManageMembersModal
                    board={board}
                    onMemberRemove={() => router.refresh()}
                  />
                  <DropdownMenuSeparator />
                  <DeleteBoardDialog
                    boardId={board._id}
                    onConfirmAction={handleDeleteBoard}
                    isLoading={isDeleteLoading}
                  >
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Board
                    </DropdownMenuItem>
                  </DeleteBoardDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
