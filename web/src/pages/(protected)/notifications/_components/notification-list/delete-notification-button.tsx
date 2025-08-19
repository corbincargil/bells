import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DeleteNotificationButtonProps {
  onDelete: (e: React.MouseEvent) => void;
  isPending: boolean;
}

export const DeleteNotificationButton = ({
  onDelete,
  isPending,
}: DeleteNotificationButtonProps) => {
  return (
    <Button
      variant="ghost"
      type="button"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        onDelete(e);
      }}
    >
      <X className="w-4 h-4" />
    </Button>
  );
};
