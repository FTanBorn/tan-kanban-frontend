"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { TaskPriority } from "@/lib/types/task";
import { useBoardStore } from "@/store/board-store";
import { useToast } from "@/hooks/use-toast";
import { BoardMember } from "@/lib/types/board";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Form Validation Schema
const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(50000, "Description is too long").optional(),
  priority: z.enum([
    TaskPriority.LOW,
    TaskPriority.MEDIUM,
    TaskPriority.HIGH,
    TaskPriority.URGENT,
  ]),
  dueDate: z.string().optional(),
  assignees: z.array(z.string()),
  labels: z.array(z.string()),
});

type TaskFormValues = z.infer<typeof taskSchema>;

// Example Labels (Bu kısım normalde API'den gelecek)
const AVAILABLE_LABELS = [
  { id: "bug", name: "Bug", color: "#E11D48" },
  { id: "feature", name: "Feature", color: "#16A34A" },
  { id: "improvement", name: "Improvement", color: "#2563EB" },
];

interface CreateTaskModalProps {
  boardId: string;
  columnId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskModal({
  boardId,
  columnId,
  open,
  onOpenChange,
}: CreateTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { createTask, activeBoard } = useBoardStore();
  const { toast } = useToast();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM,
      assignees: [],
      labels: [],
    },
  });

  const boardMembers = activeBoard?.members || ([] as BoardMember[]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      setIsLoading(true);

      await createTask(boardId, columnId, {
        ...values,
        dueDate: values.dueDate || undefined,
      });

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      handleClose();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                      <SelectItem value={TaskPriority.MEDIUM}>
                        Medium
                      </SelectItem>
                      <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                      <SelectItem value={TaskPriority.URGENT}>
                        Urgent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assignees */}
            <FormField
              control={form.control}
              name="assignees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignees</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = new Set(field.value);
                      if (currentValues.has(value)) {
                        currentValues.delete(value);
                      } else {
                        currentValues.add(value);
                      }
                      field.onChange(Array.from(currentValues));
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select members" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {boardMembers.map((member: BoardMember) => (
                        <SelectItem
                          key={member._id}
                          value={member._id}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span>{member.name}</span>
                            {field.value.includes(member._id) && (
                              <span className="ml-auto">✓</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((memberId) => {
                      const member = boardMembers.find(
                        (m: BoardMember) => m._id === memberId
                      );
                      return (
                        member && (
                          <div
                            key={memberId}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                          >
                            {member.name}
                          </div>
                        )
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Labels */}
            <FormField
              control={form.control}
              name="labels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labels</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const currentValues = new Set(field.value);
                      if (currentValues.has(value)) {
                        currentValues.delete(value);
                      } else {
                        currentValues.add(value);
                      }
                      field.onChange(Array.from(currentValues));
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select labels" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_LABELS.map((label) => (
                        <SelectItem
                          key={label.id}
                          value={label.id}
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: label.color }}
                            />
                            <span>{label.name}</span>
                            {field.value.includes(label.id) && (
                              <span className="ml-auto">✓</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((labelId) => {
                      const label = AVAILABLE_LABELS.find(
                        (l) => l.id === labelId
                      );
                      return (
                        label && (
                          <div
                            key={labelId}
                            className="px-2 py-1 rounded-md text-sm"
                            style={{
                              backgroundColor: `${label.color}20`,
                              color: label.color,
                            }}
                          >
                            {label.name}
                          </div>
                        )
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
