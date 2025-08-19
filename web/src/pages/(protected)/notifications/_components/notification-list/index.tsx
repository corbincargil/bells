import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteNotification,
  useNotifications,
} from "@/lib/api/notificaitons";
import NotificationCard from "../notification-card";
import { NotificationListLoading } from "./loading";
import { NotificationListFallback } from "./fallback";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router";

//todo: add "archived" tab and db action
const tabs = ["primary", "unread", "read", "deleted"] as const;

const NotificationList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get("tab") ?? "primary") as (typeof tabs)[number];

  const { data: notifications, isLoading, error } = useNotifications();
  const { mutate: deleteNotification, isPending } = useDeleteNotification();
  const queryClient = useQueryClient();

  const onDelete = (notificationId: string) => {
    if (!notificationId) return;

    deleteNotification(notificationId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast.success("Notification deleted successfully");
      },
      onError: (e) => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast.error(`Failed to delete notification: ${e.message}`);
      },
    });
  };

  if (isLoading) return <NotificationListLoading />;

  if (error) return <NotificationListFallback />;

  if (!notifications || notifications.length === 0)
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-md font-semibold text-foreground">
          No notifications
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You're all caught up! 🎉
        </p>
      </div>
    );

  return (
    <Tabs defaultValue="primary" value={tab} className="flex-1 h-[90%]">
      <TabsList>
        <TabsTrigger
          value="primary"
          onClick={() => setSearchParams({ tab: "primary" }, { replace: true })}
        >
          Primary
        </TabsTrigger>
        <TabsTrigger
          value="unread"
          onClick={() => setSearchParams({ tab: "unread" })}
        >
          Unread
        </TabsTrigger>
        <TabsTrigger
          value="read"
          onClick={() => setSearchParams({ tab: "read" })}
        >
          Read
        </TabsTrigger>
        <TabsTrigger
          value="deleted"
          onClick={() => setSearchParams({ tab: "deleted" })}
        >
          Deleted
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="primary"
        className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
      >
        {notifications
          .filter((n) => !n.isDeleted)
          .map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onDelete={() => onDelete(notification.uuid)}
              isPending={isPending}
            />
          ))}
      </TabsContent>
      <TabsContent
        value="unread"
        className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
      >
        {notifications
          .filter((n) => !n.isRead && !n.isDeleted)
          .map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onDelete={() => onDelete(notification.uuid)}
              isPending={isPending}
            />
          ))}
      </TabsContent>
      <TabsContent
        value="read"
        className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
      >
        {notifications
          .filter((n) => n.isRead && !n.isDeleted)
          .map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onDelete={() => onDelete(notification.uuid)}
              isPending={isPending}
            />
          ))}
      </TabsContent>
      <TabsContent
        value="deleted"
        className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
      >
        {notifications
          .filter((n) => n.isDeleted)
          .map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onDelete={() => onDelete(notification.uuid)}
              isPending={isPending}
            />
          ))}
      </TabsContent>
    </Tabs>
  );
};

export default NotificationList;
