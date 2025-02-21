"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Check, Loader2, X } from "lucide-react";
import { useInvitationStore } from "@/store/invitation-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useBoardStore } from "@/store/board-store";

export function InvitationDropdown() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { fetchBoards } = useBoardStore();
  const { toast } = useToast();

  const {
    receivedInvitations,
    loading,
    acceptInvitation,
    rejectInvitation,
    fetchInvitations,
  } = useInvitationStore();

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleResponse = async (invitationId: string, accept: boolean) => {
    try {
      setLoadingId(invitationId);
      if (accept) {
        await acceptInvitation(invitationId);
        toast({
          title: "Success",
          description: "Invitation accepted successfully",
        });
        await fetchBoards();
      } else {
        await rejectInvitation(invitationId);
        toast({
          title: "Success",
          description: "Invitation rejected",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process invitation",
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-[400px]">
      <div className="p-4 border-b">
        <h4 className="font-semibold">Invitations</h4>
        <p className="text-sm text-muted-foreground">
          {receivedInvitations.length === 0
            ? "No pending invitations"
            : `${receivedInvitations.length} pending invitation${
                receivedInvitations.length === 1 ? "" : "s"
              }`}
        </p>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-4">
          {receivedInvitations.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No pending invitations
            </p>
          ) : (
            receivedInvitations.map((invitation) => (
              <div
                key={invitation._id}
                className={cn(
                  "p-4 rounded-lg border bg-card",
                  loadingId === invitation._id && "opacity-50"
                )}
              >
                <div className="space-y-2">
                  <div>
                    <h4 className="font-semibold">{invitation.board.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Invited by {invitation.invitedBy.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(invitation.createdAt), "d MMMM yyyy", {
                        locale: tr,
                      })}
                    </p>
                  </div>
                  {invitation.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleResponse(invitation._id, true)}
                        disabled={loadingId === invitation._id}
                        className="flex-1"
                      >
                        {loadingId === invitation._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResponse(invitation._id, false)}
                        disabled={loadingId === invitation._id}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
