import NotificationList from "@/pages/(protected)/notifications/_components/notification-list";
import { ErrorBoundary } from "react-error-boundary";
import { NotificationListFallback } from "./_components/notification-list/fallback";
import { NotificationStatusBanner } from "@/components/banners/notification-status-banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useSearchParams } from "react-router";
import { useNotifications } from "@/lib/api/notificaitons";
import { NotificationListLoading } from "./_components/notification-list/loading";

const tabs = ["primary", "unread", "read", "archived"] as const;

const Notifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = (searchParams.get("tab") ?? "primary") as (typeof tabs)[number];

  const { data: notifications, isLoading, error } = useNotifications();

  if (error) return <NotificationListFallback />;

  if (isLoading)
    return (
      <div className="h-full flex flex-col">
        <div className="pb-2 sm:pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight font-heading">
            Notifications
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0 sm:mt-2">
            Stay updated with your latest activity
          </p>
        </div>
        <NotificationListLoading />
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      <div className="pb-2 sm:pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight font-heading">
          Notifications
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-0 sm:mt-2">
          Stay updated with your latest activity
        </p>
      </div>
      <NotificationStatusBanner />
      <ErrorBoundary fallback={<NotificationListFallback />}>
        <Tabs defaultValue="primary" value={tab} className="flex-1 h-[90%]">
          <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
            <TabsTrigger
              value="primary"
              className="cursor-pointer"
              onClick={() => setSearchParams({ tab: "primary" })}
            >
              Primary
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="cursor-pointer"
              onClick={() => setSearchParams({ tab: "unread" })}
            >
              Unread
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className="cursor-pointer"
              onClick={() => setSearchParams({ tab: "read" })}
            >
              Read
            </TabsTrigger>
            <TabsTrigger
              value="archived"
              className="cursor-pointer"
              onClick={() => setSearchParams({ tab: "archived" })}
            >
              Archived
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="primary"
            className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
          >
            <NotificationList
              notifications={notifications?.filter((n) => !n.isArchived)}
            />
          </TabsContent>
          <TabsContent
            value="unread"
            className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
          >
            <NotificationList
              notifications={notifications?.filter(
                (n) => !n.isRead && !n.isArchived
              )}
            />
          </TabsContent>
          <TabsContent
            value="read"
            className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
          >
            <NotificationList
              notifications={notifications?.filter(
                (n) => n.isRead && !n.isArchived
              )}
            />
          </TabsContent>
          <TabsContent
            value="archived"
            className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
          >
            <NotificationList
              notifications={notifications?.filter((n) => n.isArchived)}
            />
          </TabsContent>
        </Tabs>
      </ErrorBoundary>
      <Outlet />
    </div>
  );
};

export default Notifications;
