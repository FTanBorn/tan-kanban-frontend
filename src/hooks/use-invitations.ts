import { useInvitationStore } from "@/store/invitation-store";
import { useRef, useEffect } from "react";

export function useInvitations() {
  const store = useInvitationStore();
  const storeRef = useRef(store);

  const pendingInvitations = store.invitations.filter(
    (inv) => inv.status === "pending"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await storeRef.current.fetchInvitations();
      } catch (error) {
        console.error("Error fetching invitations:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    invitations: store.invitations,
    pendingInvitations,
    loading: store.loading,
    error: store.error,
    unreadCount: pendingInvitations.length,
    acceptInvitation: store.acceptInvitation,
    rejectInvitation: store.rejectInvitation,
  };
}
