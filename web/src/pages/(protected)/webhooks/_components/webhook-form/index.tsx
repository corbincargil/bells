import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Webhook } from "@/types/webhook";
import { useState } from "react";

interface WebhookFormProps {
  webhook?: Webhook;
  onCancel: () => void;
}

export const WebhookForm = ({ webhook, onCancel }: WebhookFormProps) => {
  const [isActive, setIsActive] = useState(true);
  return (
    <div className="h-full max-h-[90vh] flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Create Webhook
        </h2>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="My webhook"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Active?
              </label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              URL Slug
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="my-webhook"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notification Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notification Message
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
              rows={3}
              placeholder="Optional description"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" className="flex-1">
              {webhook ? "Update Webhook" : "Create Webhook"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
