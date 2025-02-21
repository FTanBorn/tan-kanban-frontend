// src/components/board/column-list.tsx
"use client";

import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "@/lib/types/board";
import { BoardColumn } from "./board-column";
import { CreateColumnButton } from "./create-column-button";

interface ColumnListProps {
  boardId: string;
  columns: Column[];
  activeTaskId: string | null;
}

export function ColumnList({
  boardId,
  columns,
  activeTaskId,
}: ColumnListProps) {
  const columnIds = columns
    .filter((col) => col._id)
    .map((col) => col._id) as string[];

  return (
    <div className="flex items-start gap-4 h-full">
      <SortableContext
        items={columnIds}
        strategy={horizontalListSortingStrategy}
      >
        {columns.map((column) => (
          <BoardColumn
            key={column._id}
            boardId={boardId}
            column={column}
            activeTaskId={activeTaskId}
          />
        ))}
      </SortableContext>

      <CreateColumnButton boardId={boardId} />
    </div>
  );
}
