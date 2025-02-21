import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Column } from "@/lib/types/board";
import { useBoardStore } from "@/store/board-store";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

const columnSchema = z.object({
  name: z
    .string()
    .min(1, "Column name is required")
    .max(50, "Name is too long"),
  type: z.enum(["todo", "in-progress", "done", "custom"] as const),
  color: z.string().optional(),
  limit: z.coerce
    .number()
    .min(0, "Limit must be 0 or greater")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .nullable(),
});

type ColumnFormValues = z.infer<typeof columnSchema>;

interface EditColumnModalProps {
  column: Column;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditColumnModal({
  column,
  open,
  onOpenChange,
}: EditColumnModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { activeBoard, updateColumn } = useBoardStore();
  const { toast } = useToast();

  const form = useForm<ColumnFormValues>({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      name: column.name,
      type: column.type,
      color: column.color,
      limit: column.limit || null,
    },
  });

  const handleClose = () => {
    form.reset({
      name: column.name,
      type: column.type,
      color: column.color,
      limit: column.limit || null,
    });
    onOpenChange(false);
  };

  const onSubmit = async (values: ColumnFormValues) => {
    if (!activeBoard) return;

    try {
      setIsLoading(true);

      if (column.isDefault && values.type !== column.type) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Cannot change type of default column",
        });
        return;
      }

      await updateColumn(activeBoard._id, column._id, {
        name: values.name,
        type: column.isDefault ? column.type : values.type,
        color: values.color,
        limit: values.limit || undefined,
      });

      toast({
        title: "Success",
        description: "Column updated successfully",
      });

      handleClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update column",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
          <DialogDescription>
            Make changes to your column settings
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter column name"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading || column.isDefault}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select column type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {column.isDefault && (
                    <p className="text-xs text-muted-foreground">
                      Type cannot be changed for default columns
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
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
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
