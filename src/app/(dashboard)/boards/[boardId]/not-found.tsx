// src/app/(dashboard)/boards/[boardId]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BoardNotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Board not found</h2>
      <p className="text-muted-foreground">
        The board you're looking for doesn't exist or you don't have access to
        it.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go back to dashboard</Link>
      </Button>
    </div>
  );
}
