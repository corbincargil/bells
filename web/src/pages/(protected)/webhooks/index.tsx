import WebhookList from "./_components/webhook-list";
import { ErrorBoundary } from "react-error-boundary";
import { WebhookListFallback } from "./_components/webhook-list/fallback";
import { CreateWebhookButton } from "./_components/create-webhook-button";
import { Outlet } from "react-router";
import { NotificationStatusBanner } from "@/components/banners/notification-status-banner";

const Webhooks = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="pb-2 sm:pb-4 flex items-end justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            Webhooks
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0 sm:mt-2">
            Manage your webhooks
          </p>
        </div>
        <CreateWebhookButton />
      </div>
      <NotificationStatusBanner />
      <ErrorBoundary fallback={<WebhookListFallback />}>
        <WebhookList />
      </ErrorBoundary>
      <Outlet />
    </div>
  );
};

export default Webhooks;
