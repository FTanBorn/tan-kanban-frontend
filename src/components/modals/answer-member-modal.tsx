import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Check, Loader2, X, Users2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useInvitationStore } from "@/store/invitation-store";
import { useBoardStore } from "@/store/board-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface InvitationModalProps {
  invitation: any;
  onSuccess?: () => void;
  open: boolean;
  onClose: () => void;
}

export function AnswerMemberModal({
  invitation,
  onSuccess,
  open,
  onClose,
}: InvitationModalProps) {
  const [loading, setLoading] = useState(false);
  const { acceptInvitation, rejectInvitation } = useInvitationStore();
  const { fetchBoards } = useBoardStore();
  const { toast } = useToast();

  const handleResponse = async (accept: boolean) => {
    try {
      setLoading(true);
      if (accept) {
        await acceptInvitation(invitation.metadata?.invitationId);
        toast({
          title: "Success",
          description: "Invitation accepted successfully",
        });
        await fetchBoards();
      } else {
        await rejectInvitation(invitation.metadata?.invitationId);
        toast({ title: "Success", description: "Invitation rejected" });
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process invitation",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {invitation.board ? (
          <>
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-center gap-2">
                <Users2 className="h-5 w-5 text-blue-600" />
                Board Invitation
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                You've been invited to join a board
              </p>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font- text-md">Board Name:</h4>
                <div className="p-2 pl-5 bg-muted rounded-sm">
                  <h4 className="font-medium text-md">
                    {invitation.board?.name}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getInitials(
                      invitation.sender?.name ||
                        invitation.metadata?.invitedBy?.name
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {invitation.sender?.name ||
                      invitation.metadata?.invitedBy?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(invitation.createdAt), "d MMMM yyyy", {
                      locale: tr,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleResponse(true)}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleResponse(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </>
        ) : (
          <DialogHeader className="space-y-6">
            <DialogTitle className="flex items-center gap-5">
              The board has been erased and cannot be found.
            </DialogTitle>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
}
