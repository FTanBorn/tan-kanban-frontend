// src/lib/schemas/task.ts
import * as z from "zod";
import { TaskStatus, TaskPriority } from "@/lib/types/task";

// Base Task Schema
export const taskBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(5000, "Description is too long").optional(),
  priority: z.nativeEnum(TaskPriority),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
});

// Create Task Schema
export const createTaskSchema = taskBaseSchema;

// Update Task Schema
export const updateTaskSchema = taskBaseSchema.partial().extend({
  completedAt: z
    .string()
    .datetime({ message: "Please enter a valid date" })
    .optional(),
  spentHours: z
    .number()
    .min(0, "Spent hours must be positive")
    .max(1000, "Spent hours cannot exceed 1000")
    .optional(),
});

// Move Task Schema
export const moveTaskSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  sourceColumnId: z.string().min(1, "Source column ID is required"),
  targetColumnId: z.string().min(1, "Target column ID is required"),
  newOrder: z.number().min(0, "Order must be a positive number"),
});

// Comment Schema
export const taskCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(10000, "Comment cannot be longer than 10000 characters"),
});

// Label Schema
export const taskLabelSchema = z.object({
  name: z
    .string()
    .min(1, "Label name is required")
    .max(50, "Label name cannot be longer than 50 characters"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code"),
});

// Filter Schema
export const taskFilterSchema = z.object({
  status: z.array(z.nativeEnum(TaskStatus)).optional(),
  priority: z.array(z.nativeEnum(TaskPriority)).optional(),
  assignees: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  dueDate: z
    .object({
      from: z.string().datetime().optional(),
      to: z.string().datetime().optional(),
    })
    .optional(),
  search: z.string().optional(),
});

// Sort Schema
export const taskSortSchema = z.object({
  field: z.enum(["createdAt", "updatedAt", "dueDate", "priority", "title"]),
  direction: z.enum(["asc", "desc"]),
});

// Export types
export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;
export type MoveTaskFormValues = z.infer<typeof moveTaskSchema>;
export type TaskCommentFormValues = z.infer<typeof taskCommentSchema>;
export type TaskLabelFormValues = z.infer<typeof taskLabelSchema>;
export type TaskFilterFormValues = z.infer<typeof taskFilterSchema>;
export type TaskSortFormValues = z.infer<typeof taskSortSchema>;
