import NotificationList from "@/pages/(protected)/notifications/_components/notification-list";
import { ErrorBoundary } from "react-error-boundary";
import { NotificationListFallback } from "./_components/notification-list/fallback";

const Notifications = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="pb-2 sm:pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Notifications
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-0 sm:mt-2">
          Stay updated with your latest activity
        </p>
      </div>
      <ErrorBoundary fallback={<NotificationListFallback />}>
        <NotificationList />
      </ErrorBoundary>
    </div>
  );
};

export default Notifications;
