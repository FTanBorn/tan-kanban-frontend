"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskPriority } from "@/lib/types/task";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskDetailModal } from "./task-detail-modal";
import { Bug, Lightbulb, LucideIcon, Wrench } from "lucide-react";

interface TaskCardProps {
  task: Task;
  columnId: string;
}

const AVAILABLE_LABELS: Record<
  LabelType,
  {
    name: string;
    color: string;
    icon: LucideIcon;
  }
> = {
  bug: {
    name: "Bug",
    color: "#E11D48",
    icon: Bug,
  },
  feature: {
    name: "Feature",
    color: "#16A34A",
    icon: Lightbulb,
  },
  improvement: {
    name: "Improvement",
    color: "#2563EB",
    icon: Wrench,
  },
};

type LabelType = "bug" | "feature" | "improvement";

const priorityColors = {
  [TaskPriority.LOW]: "bg-green-500/10 text-green-700",
  [TaskPriority.MEDIUM]: "bg-yellow-500/10 text-yellow-700",
  [TaskPriority.HIGH]: "bg-orange-500/10 text-orange-700",
  [TaskPriority.URGENT]: "bg-red-500/10 text-red-700",
};

const priorityLabels = {
  [TaskPriority.LOW]: "Low",
  [TaskPriority.MEDIUM]: "Medium",
  [TaskPriority.HIGH]: "High",
  [TaskPriority.URGENT]: "Urgent",
};

export function TaskCard({ task, columnId }: TaskCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id.toString(),
    data: {
      type: "Task",
      task,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => {
          // Eğer sürükleme işlemi yapılmıyorsa modalı aç
          if (!isDragging) {
            setIsDetailOpen(true);
          }
        }}
        className={cn(
          "group relative bg-card p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing",
          "hover:border-primary/50 hover:shadow-md transition-all duration-200",
          isDragging && "opacity-50 border-primary shadow-lg",
          !isDragging && "hover:-translate-y-0.5"
        )}
      >
        {/* Task Title */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-sm font-medium line-clamp-2">{task.title}</h3>

          {/* Priority Badge */}
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
              priorityColors[task.priority as TaskPriority]
            )}
          >
            {priorityLabels[task.priority as TaskPriority]}
          </span>
        </div>

        {/* Main Assignee */}
        {task.assignees[0] && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {task.assignees[0].name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {task.assignees[0].name}
            </span>
          </div>
        )}

        {/* Label gösterimi */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.labels.map((labelId) => {
              const label = AVAILABLE_LABELS[labelId as LabelType];

              if (!label) return null;

              const Icon = label.icon;

              return (
                <div
                  key={labelId}
                  className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-sm font-medium"
                  style={{
                    backgroundColor: `${label.color}20`,
                    color: label.color,
                  }}
                >
                  <Icon className="h-3 w-3" />
                  {label.name}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={{
          _id: task._id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          assignees: task.assignees,
          labels: task.labels,
          columnId: task.columnId,
        }}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}
