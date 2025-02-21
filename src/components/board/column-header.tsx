// src/components/board/column-header.tsx
"use client";

import { Column } from "@/lib/types/board";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditColumnModal } from "./edit-column-modal";
import { DeleteColumnDialog } from "./delete-column-dialog";
import { Badge } from "@/components/ui/badge";

interface ColumnHeaderProps {
  column: Column;
  tasksCount: number;
}

export function ColumnHeader({ column }: ColumnHeaderProps) {
  const tasksCount = 0; // TODO: Tasks functionality will be added later
  const hasTaskLimit = typeof column.limit === "number";
  const isOverLimit =
    hasTaskLimit && column.limit ? tasksCount >= column.limit : false;

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">{column.name}</span>
        {hasTaskLimit && column.limit && (
          <Badge
            variant={isOverLimit ? "destructive" : "secondary"}
            className="text-xs"
          >
            {tasksCount}/{column.limit}
          </Badge>
        )}
      </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          <EditColumnModal column={column}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Column
            </DropdownMenuItem>
          </EditColumnModal>

          <DeleteColumnDialog column={column}>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Column
            </DropdownMenuItem>
          </DeleteColumnDialog>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
