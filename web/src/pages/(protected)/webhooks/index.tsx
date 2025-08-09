import WebhookList from "./_components/webhook-list";
import { ErrorBoundary } from "react-error-boundary";
import { WebhookListFallback } from "./_components/webhook-list/fallback";

const Webhooks = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="pb-2 sm:pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Webhooks
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-0 sm:mt-2">
          Manage your webhooks
        </p>
      </div>
      <ErrorBoundary fallback={<WebhookListFallback />}>
        <WebhookList />
      </ErrorBoundary>
    </div>
  );
};

export default Webhooks;
