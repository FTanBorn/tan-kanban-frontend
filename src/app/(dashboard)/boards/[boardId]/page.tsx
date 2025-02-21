// src/app/(dashboard)/boards/[boardId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  DragOverEvent,
} from "@dnd-kit/core";
import { restrictToWindowEdges, snapCenterToCursor } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import { useBoardStore } from "@/store/board-store";
import { BoardHeader } from "@/components/board/board-header";
import { ColumnList } from "@/components/board/column-list";
import { TaskCard } from "@/components/board/task-card";
import { createPortal } from "react-dom";
import { Task } from "@/lib/types/task";
import { useToast } from "@/hooks/use-toast";

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

const modifiers = [restrictToWindowEdges, snapCenterToCursor];

export default function BoardPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const { toast } = useToast();

  // Active drag states
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const {
    activeBoard,
    setActiveBoard,
    fetchBoardDetails,
    updateColumnOrder,
    moveTask,
  } = useBoardStore();

  console.log(activeBoard);
  console.log(activeColumn);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Daha hassas drag başlangıcı
      },
    })
  );

  // Fetch board details when boardId changes
  useEffect(() => {
    const loadBoard = async () => {
      if (boardId) {
        try {
          await fetchBoardDetails(boardId); // API'den güncel verileri çek
        } catch (error) {
          console.error("Failed to load board:", error);
        }
      }
    };

    loadBoard();
  }, [boardId, fetchBoardDetails]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id, data } = active;

    if (data.current?.type === "Column") {
      setActiveColumn(id as string);
    }

    if (data.current?.type === "Task") {
      setActiveTask(data.current.task as Task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !activeBoard) return;

    const activeId = active.id;

    if (active.data.current?.type !== "Task") return;

    // Kaynak kolonu bul
    const activeColumn = activeBoard.columns.find((col) =>
      col.tasks.some((task) => task._id === activeId)
    );

    // Hedef kolonu bul - ya doğrudan kolon ID'si ya da içindeki bir task'ın ID'si üzerinden
    const targetColumnId =
      over.data.current?.type === "Column"
        ? over.data.current.columnId // Doğrudan kolon üzerine gelince
        : over.data.current?.columnId || over.data.current?.task?.columnId; // Task üzerine gelince

    const overColumn = activeBoard.columns.find(
      (col) => col._id === targetColumnId
    );

    if (!activeColumn || !overColumn) return;

    // Farklı kolonlar arasında taşıma
    if (activeColumn._id !== overColumn._id) {
      const activeTask = activeColumn.tasks.find(
        (task) => task._id === activeId
      );
      if (!activeTask) return;

      setActiveBoard({
        ...activeBoard,
        columns: activeBoard.columns.map((col) => {
          // Kaynak kolondan task'ı kaldır
          if (col._id === activeColumn._id) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task._id !== activeId),
            };
          }
          // Hedef kolona task'ı ekle
          if (col._id === overColumn._id) {
            // Task'ın ekleneceği pozisyonu belirle
            let newTaskOrder = col.tasks.length;
            if (over.data.current?.task) {
              // Eğer bir task'ın üzerine gelindiyse, o pozisyona ekle
              newTaskOrder = col.tasks.findIndex((t) => t._id === over.id);
              if (newTaskOrder === -1) newTaskOrder = col.tasks.length;
            }

            const updatedTasks = [...col.tasks];
            const updatedTask = { ...activeTask, columnId: col._id };
            updatedTasks.splice(newTaskOrder, 0, updatedTask);

            return {
              ...col,
              tasks: updatedTasks,
            };
          }
          return col;
        }),
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !activeBoard) {
      setActiveTask(null);
      return;
    }

    // Column taşıma
    if (active.data.current?.type === "Column") {
      const oldIndex = activeBoard.columns.findIndex(
        (col) => col._id === active.id
      );
      const newIndex = activeBoard.columns.findIndex(
        (col) => col._id === over.id
      );

      if (oldIndex !== newIndex) {
        // Kolonların yeni sırasını hesapla
        const newColumns = arrayMove(activeBoard.columns, oldIndex, newIndex);
        const updatedColumns = newColumns.map((col, index) => ({
          ...col,
          order: index,
        }));

        // State'i güncelle
        setActiveBoard({
          ...activeBoard,
          columns: updatedColumns,
        });

        try {
          await updateColumnOrder(boardId, active.id as string, newIndex);
        } catch (error) {
          console.log(error);
          toast({
            title: "Error",
            description: "Failed to update column order",
            variant: "destructive",
          });
        }
      }
      return;
    }

    // Task taşıma
    if (active.data.current?.type === "Task") {
      const task = active.data.current.task;
      const sourceColumnId = active.data.current.columnId;
      const targetColumnId =
        over.data.current?.columnId?.replace("column-", "") ||
        over.data.current?.column?._id;

      if (!targetColumnId) {
        setActiveTask(null);
        return;
      }

      try {
        // Mevcut board state'ini kopyala ve kolon sıralamasını koru
        const currentColumns = [...activeBoard.columns].map((col) => ({
          ...col,
          tasks: [...col.tasks],
        }));

        const sourceColumn = currentColumns.find(
          (col) => col._id === sourceColumnId
        );
        const targetColumn = currentColumns.find(
          (col) => col._id === targetColumnId
        );

        if (!sourceColumn || !targetColumn) {
          setActiveTask(null);
          return;
        }

        // Task'ı taşı
        const newTask = { ...task, columnId: targetColumnId };
        const taskIndex = sourceColumn.tasks.findIndex(
          (t) => t._id === task._id
        );
        const newIndex = over.data.current?.task
          ? targetColumn.tasks.findIndex((t) => t._id === over.id)
          : targetColumn.tasks.length;

        // Kaynak kolondan task'ı kaldır
        if (sourceColumnId === targetColumnId) {
          sourceColumn.tasks.splice(taskIndex, 1);
          sourceColumn.tasks.splice(newIndex, 0, newTask);
        } else {
          sourceColumn.tasks = sourceColumn.tasks.filter(
            (t) => t._id !== task._id
          );
          targetColumn.tasks.splice(newIndex, 0, newTask);
        }

        // Order'ları güncelle
        currentColumns.forEach((col) => {
          col.tasks = col.tasks.map((t, idx) => ({ ...t, order: idx }));
        });

        // State'i güncelle
        setActiveBoard({
          ...activeBoard,
          columns: currentColumns,
        });

        // API çağrısı
        await moveTask(boardId, task._id, {
          targetColumnId,
          order: newIndex,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to move task",
          variant: "destructive",
        });
      }
    }

    setActiveTask(null);
  };

  if (!activeBoard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-background/95">
      <BoardHeader board={activeBoard} />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={modifiers}
      >
        <div className="flex-1 overflow-x-auto px-6 py-4">
          <div className="flex gap-4 min-h-[calc(100vh-8rem)]">
            <ColumnList
              boardId={boardId}
              columns={activeBoard.columns}
              activeTaskId={activeTask?._id || null}
            />
          </div>
        </div>

        {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeTask && (
              <div className="transform-gpu opacity-90 scale-105 rotate-2 shadow-2xl">
                <TaskCard
                  task={activeTask}
                  columnId={
                    activeBoard.columns.find((col) =>
                      col.tasks.some((t) => t._id === activeTask._id)
                    )?._id || ""
                  }
                />
              </div>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
