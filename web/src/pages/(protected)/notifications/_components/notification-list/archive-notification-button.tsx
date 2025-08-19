import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ArchiveNotificationButtonProps {
  onArchive: (e: React.MouseEvent) => void;
  isPending: boolean;
}

export const ArchiveNotificationButton = ({
  onArchive,
  isPending,
}: ArchiveNotificationButtonProps) => {
  return (
    <Button
      variant="ghost"
      type="button"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        onArchive(e);
      }}
    >
      <X className="w-4 h-4" />
    </Button>
  );
};
