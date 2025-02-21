// src/components/modals/manage-members-modal.tsx
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Users } from "lucide-react";
import { Board } from "@/lib/types/board";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/utils/axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ManageMembersModalProps {
  board: Board;
  onMemberRemove?: () => void;
}

export function ManageMembersModal({
  board,
  onMemberRemove,
}: ManageMembersModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [removingId, setRemovingId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const isOwner = session?.user?.id === board.owner?._id;

  const handleRemoveMember = async (memberId: string) => {
    try {
      setIsLoading(true);
      setRemovingId(memberId);

      await axios.delete(`/api/boards/${board._id}/members/${memberId}`);

      toast({
        title: "Success",
        description: "Member has been removed from the board",
      });

      onMemberRemove?.();
      setSelectedMemberId("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to remove member",
      });
    } finally {
      setIsLoading(false);
      setRemovingId("");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Users className="w-4 h-4 mr-2" />
            Manage Members
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Board Members</DialogTitle>
            <DialogDescription>
              View and manage members of this board
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-4">
              {/* Owner */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-100/20 to-yellow-100/10 border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {board.owner?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{board.owner?.name}</p>
                      <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">
                        Owner
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {board.owner?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Members */}
              {board.members
                ?.filter((member: any) => member._id !== board.owner?._id) // Owner'ı filtrele
                ?.map((member: any) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-muted/20 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-500/10 text-blue-600 font-medium">
                          {member.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        disabled={isLoading && removingId === member._id}
                        onClick={() => setSelectedMemberId(member._id)}
                      >
                        {isLoading && removingId === member._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Remove"
                        )}
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!selectedMemberId}
        onOpenChange={(open) => !open && setSelectedMemberId("")}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the board? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRemoveMember(selectedMemberId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
