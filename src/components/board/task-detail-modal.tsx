"use client";

import { useState } from "react";
import { AlertCircle, Edit2, Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { TaskPriority } from "@/lib/types/task";
import { useBoardStore } from "@/store/board-store";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskAssignee {
  _id: string;
  name: string;
  email: string;
}

interface TaskDetailModalProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    assignees: TaskAssignee[];
    labels: string[];
    columnId: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// EditableField componenti
interface EditableFieldProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  isTitle?: boolean;
}

function EditableField({ value, onSave, isTitle }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (editValue.trim() === value) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await onSave(editValue);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Updated successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {isTitle ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-2 py-1 text-xl font-semibold bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
            autoFocus
          />
        ) : (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-2 py-1 text-sm bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            disabled={isLoading}
            rows={3}
            autoFocus
          />
        )}
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(false)}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      {isTitle ? (
        <h2 className="text-xl font-semibold pr-8">{value}</h2>
      ) : (
        <p className="text-sm text-muted-foreground pr-8 whitespace-pre-wrap">
          {value || "No description provided"}
        </p>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
        onClick={() => setIsEditing(true)}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

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

export function TaskDetailModal({
  task,
  open,
  onOpenChange,
}: TaskDetailModalProps) {
  const { updateTask, activeBoard } = useBoardStore();

  const handleUpdateTitle = async (newTitle: string) => {
    if (!activeBoard?._id) return;
    await updateTask(activeBoard._id, task._id, { title: newTitle });
  };

  const handleUpdateDescription = async (newDescription: string) => {
    if (!activeBoard?._id) return;
    await updateTask(activeBoard._id, task._id, {
      description: newDescription,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="sr-only">Task Details</DialogTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <EditableField
                value={task.title}
                onSave={handleUpdateTitle}
                isTitle
              />
              <Badge
                variant="secondary"
                className={cn(priorityColors[task.priority])}
              >
                {priorityLabels[task.priority]}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Description
              </h3>
              <EditableField
                value={task.description || ""}
                onSave={handleUpdateDescription}
              />
            </div>

            {/* Assignees */}
            {task.assignees?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {task.assignees.map((assignee) => (
                  <div
                    key={assignee._id}
                    className="flex items-center gap-2 bg-secondary p-1 pl-1 pr-3 rounded-full"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {assignee.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{assignee.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
