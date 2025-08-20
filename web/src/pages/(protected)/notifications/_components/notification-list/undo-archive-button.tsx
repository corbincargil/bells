import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UndoArchiveButtonProps {
  onUndoArchive: (e: React.MouseEvent) => void;
  isPending: boolean;
}

export const UndoArchiveButton = ({
  onUndoArchive,
  isPending,
}: UndoArchiveButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            onUndoArchive(e);
          }}
          disabled={isPending}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Restore</p>
      </TooltipContent>
    </Tooltip>
  );
};
