"use client";

import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column } from "@/lib/types/board";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CreateTaskModal } from "../modals/create-task-modal";
import { Button } from "../ui/button";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EditColumnModal } from "./edit-column-modal";
import { DeleteColumnDialog } from "./delete-column-dialog";

interface BoardColumnProps {
  boardId: string;
  column: Column;
  activeTaskId: string | null;
}

export function BoardColumn({
  boardId,
  column,
  activeTaskId,
}: BoardColumnProps) {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isUpdateColumnModalOpen, setIsUpdateColumnModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tasksCount = 0;
  const hasTaskLimit = typeof column.limit === "number";
  const isOverLimit =
    hasTaskLimit && column.limit ? tasksCount >= column.limit : false;

  // Column için sürükle-bırak
  const {
    attributes,
    listeners,
    setNodeRef: setColumnRef,
    transform,
    transition,
    isDragging: isColumnDragging,
  } = useSortable({
    id: column._id || "temp-id",
    data: {
      type: "Column",
      column,
    },
  });

  const { setNodeRef: setDropRef, isOver: isColumnOver } = useDroppable({
    id: `column-${column._id}`,
    data: {
      type: "Column",
      columnId: column._id,
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sortedTasks = [...column.tasks].sort((a, b) => a.order - b.order);

  return (
    <>
      <div
        ref={setColumnRef}
        style={style}
        className={cn(
          "w-[300px] h-full flex-shrink-0 flex flex-col rounded-lg",
          "bg-gradient-to-b from-muted/50 to-background border",
          "transition-colors duration-200",
          isColumnDragging &&
            "opacity-50 border-primary/50 ring-1 ring-primary/20",
          isColumnOver &&
            !isColumnDragging &&
            "ring-1 ring-primary/20 bg-muted/10"
        )}
      >
        {/* Kolon Başlığı */}
        <div
          {...attributes}
          {...listeners}
          className="p-3 flex items-center justify-between border-b bg-gradient-to-r from-background to-muted/5"
        >
          <div className="flex items-center gap-3">
            <span className="font-medium">{column.name}</span>
            {hasTaskLimit && column.limit && (
              <Badge
                variant={isOverLimit ? "destructive" : "secondary"}
                className={cn(
                  "text-xs font-normal",
                  !isOverLimit && "bg-primary/10 hover:bg-primary/15"
                )}
              >
                {tasksCount}/{column.limit}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => setIsCreateTaskModalOpen(true)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" />
            </Button>

            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setIsUpdateColumnModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Column
                </DropdownMenuItem>

                <DeleteColumnDialog column={column}>
                  <DropdownMenuItem
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Column
                  </DropdownMenuItem>
                </DeleteColumnDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Task Listesi */}
        <div
          ref={setDropRef}
          className={cn(
            "flex-1 p-2 flex flex-col gap-2 overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20",
            isColumnOver && !isColumnDragging && "bg-muted/30"
          )}
        >
          <SortableContext
            items={sortedTasks.map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedTasks.map((task) => (
              <TaskCard key={task._id} task={task} columnId={column._id} />
            ))}
          </SortableContext>

          {column.tasks.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <span className="text-sm py-8">Drop tasks here</span>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditColumnModal
        column={column}
        open={isUpdateColumnModalOpen}
        onOpenChange={setIsUpdateColumnModalOpen}
      />
      <CreateTaskModal
        boardId={boardId}
        columnId={column._id}
        open={isCreateTaskModalOpen}
        onOpenChange={setIsCreateTaskModalOpen}
      />
    </>
  );
}
