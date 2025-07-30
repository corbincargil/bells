import { useWebhooks } from "@/lib/api/webhooks";
import WebhookCard from "./webhook-card";

const WebhookList = () => {
  const { data: webhooks, isLoading, isError } = useWebhooks();

  if (isLoading)
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="m-3 bg-muted border border-border rounded-lg p-6"
            >
              <div className="h-6 bg-muted-foreground/20 rounded mb-3"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
        <div className="flex items-center">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-destructive">
              Error loading webhooks
            </h3>
            <p className="text-sm text-destructive/80 mt-1">
              Please try again later.
            </p>
          </div>
        </div>
      </div>
    );

  if (!webhooks || webhooks.length === 0)
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-foreground">
          No webhooks
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating your first webhook.
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {webhooks.map((webhook) => (
        <WebhookCard key={webhook.uuid} webhook={webhook} />
      ))}
    </div>
  );
};

export default WebhookList;
