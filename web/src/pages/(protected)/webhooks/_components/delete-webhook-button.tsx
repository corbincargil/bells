import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteWebhookButtonProps {
  onDelete: () => void;
  isPending: boolean;
}

export const DeleteWebhookButton = ({
  onDelete,
  isPending,
}: DeleteWebhookButtonProps) => {
  const root = document.getElementById("root");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button" disabled={isPending}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent container={root ?? undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Delete Webhook
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this webhook? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="text-foreground"
            type="button"
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={onDelete}
            disabled={isPending}
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
