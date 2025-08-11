import { useState } from "react";
import { Button } from "@/components/ui/button";
import formatRelativeTime from "@/lib/format-relative-time";
import { cn } from "@/lib/utils";
import type { Webhook } from "@/types/webhook";
import { Check, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WebhookCard = ({ webhook }: { webhook: Webhook }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(webhook.slug);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 4000);
  };

  return (
    <div className="group w-full flex items-center gap-3 bg-card border border-border cursor-pointer rounded-lg p-4 hover:bg-accent/50 hover:shadow-sm transition-all duration-200">
      <div className="flex flex-col w-full gap-1 sm:gap-2">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {webhook.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {webhook.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <time className="text-xs text-muted-foreground">
            Last used:{" "}
            {webhook.lastUsed ? formatRelativeTime(webhook.lastUsed) : ""}
          </time>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                webhook.isActive ? "bg-green-400" : "bg-red-400"
              )}
            />
            <span className="text-xs text-muted-foreground">
              {webhook.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 p-2 hover:text-secondary"
            onClick={copyToClipboard}
            disabled={!webhook.slug}
          >
            {isCopied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? "Copied!" : "Copy to clipboard"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default WebhookCard;
