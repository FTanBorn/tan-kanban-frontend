// src/components/board/create-column-button.tsx
"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CreateColumnModal } from "../modals/create-column-modal";

interface CreateColumnButtonProps {
  boardId: string;
}

export function CreateColumnButton({ boardId }: CreateColumnButtonProps) {
  return (
    <CreateColumnModal boardId={boardId}>
      <Button
        variant="outline"
        className="h-[112px] w-[300px] justify-center flex-col gap-2 border-dashed"
      >
        <Plus className="h-5 w-5" />
        <span>Add Column</span>
      </Button>
    </CreateColumnModal>
  );
}
