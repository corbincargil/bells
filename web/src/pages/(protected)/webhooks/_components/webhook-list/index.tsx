import { useWebhooks } from "@/lib/api/webhooks";
import WebhookCard from "../webhook-card";
import { WebhookListLoading } from "./loading";
import { WebhookListFallback } from "./fallback";
import { Button } from "@/components/ui/button";

const WebhookList = () => {
  const { data: webhooks, isLoading, isError } = useWebhooks();

  if (isLoading) return <WebhookListLoading />;

  if (isError) return <WebhookListFallback />;

  if (!webhooks || webhooks.length === 0)
    return (
      <div className="flex-1 border border-border rounded-lg p-2 overflow-y-auto space-y-1 sm:space-y-2 text-center">
        <h3 className="mt-2 text-md font-semibold text-foreground">
          No webhooks
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating your first webhook.
        </p>
        <Button className="mt-4">Create Webhook</Button>
      </div>
    );

  return (
    <div className="flex-1 border border-border rounded-lg p-2 overflow-y-auto space-y-1 sm:space-y-2">
      {webhooks.map((webhook) => (
        <WebhookCard key={webhook.uuid} webhook={webhook} />
      ))}
    </div>
  );
};

export default WebhookList;
