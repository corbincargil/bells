import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

export const CreateWebhookButtonFallback = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button disabled>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Webhook</span>
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="w-64">
        <p>
          An error occurred while loading the webhook form. Please refresh the
          page.
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
