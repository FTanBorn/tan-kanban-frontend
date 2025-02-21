// src/components/invitations/invitation-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Loader2, Check, X } from "lucide-react";
import { useInvitationStore } from "@/store/invitation-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function InvitationList() {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    receivedInvitations,
    loading,
    error,
    acceptInvitation,
    rejectInvitation,
  } = useInvitationStore();

  const handleResponse = async (invitationId: string, accept: boolean) => {
    try {
      setLoadingId(invitationId);

      if (accept) {
        await acceptInvitation(invitationId);
        toast({
          title: "Başarılı",
          description: "Board'a başarıyla katıldınız",
        });
        router.refresh();
      } else {
        await rejectInvitation(invitationId);
        toast({
          title: "Bilgi",
          description: "Davet reddedildi",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error?.message || "İşlem sırasında bir hata oluştu",
      });
    } finally {
      setLoadingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gelen Davetler</CardTitle>
        <CardDescription>Board davetlerinizi yönetin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {receivedInvitations.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Henüz bir davet almadınız
            </p>
          ) : (
            receivedInvitations.map((invitation) => (
              <Card key={invitation._id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{invitation.board.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {invitation.invitedBy.name} tarafından davet edildiniz
                      </p>
                      <p className="text-sm text-muted-foreground">
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
                        >
                          {loadingId === invitation._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResponse(invitation._id, false)}
                          disabled={loadingId === invitation._id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
