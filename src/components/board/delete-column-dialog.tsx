import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBoardStore } from "@/store/board-store";

interface DeleteColumnDialogProps {
  columnId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteColumnDialog({
  columnId,
  open,
  onOpenChange,
}: DeleteColumnDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteColumn, activeBoard } = useBoardStore();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteColumn(activeBoard?._id || "", columnId);
      toast({ title: "Success", description: "Column deleted successfully" });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete column",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Column</AlertDialogTitle>
          <AlertDialogDescription>Are you sure?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
