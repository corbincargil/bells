import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useNotifications,
  usePatchArchiveStatus,
} from "@/lib/api/notificaitons";
import NotificationCard from "../notification-card";
import { NotificationListLoading } from "./loading";
import { NotificationListFallback } from "./fallback";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router";

const tabs = ["primary", "unread", "read", "archived"] as const;

const NotificationList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const tab = (searchParams.get("tab") ?? "primary") as (typeof tabs)[number];

  const { data: notifications, isLoading, error } = useNotifications();
  const { mutate: archiveNotification, isPending } = usePatchArchiveStatus();

  const onArchive = (notificationId: string) => {
    // todo: add optimistic updates
    archiveNotification(
      {
        notificationId,
        isArchived: true,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (e) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          toast.error(`Failed to archive notification: ${e.message}`);
        },
      }
    );
  };

  const onUndoArchive = (notificationId: string) => {
    archiveNotification(
      {
        notificationId,
        isArchived: false,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          toast.success("Notification unarchived successfully");
        },
        onError: (e) => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          toast.error(`Failed to unarchive notification: ${e.message}`);
        },
      }
    );
  };

  if (isLoading) return <NotificationListLoading />;

  if (error) return <NotificationListFallback />;

  // todo: update so that this is shown if no notifications on the selected tab
  if (!notifications || notifications.length === 0)
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-xl font-semibold text-foreground font-playful">
          No notifications
        </h3>
        <p className="mt-1 text-lg text-muted-foreground font-playful">
          You're all caught up! 🎉
        </p>
      </div>
    );

  return (
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
        {notifications
          .filter((n) => !n.isArchived)
          .map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onArchive={() => onArchive(notification.uuid)}
              onUndoArchive={() => onUndoArchive(notification.uuid)}
              isPending={isPending}
            />
          ))}
      </TabsContent>
      <TabsContent
        value="unread"
        className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
      >
        {notifications
          .filter((n) => !n.isRead && !n.isArchived)
          .map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onArchive={() => onArchive(notification.uuid)}
              onUndoArchive={() => onUndoArchive(notification.uuid)}
              isPending={isPending}
            />
          ))}
      </TabsContent>
      <TabsContent
        value="read"
        className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
      >
        {notifications
          .filter((n) => n.isRead && !n.isArchived)
          .map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onArchive={() => onArchive(notification.uuid)}
              onUndoArchive={() => onUndoArchive(notification.uuid)}
              isPending={isPending}
            />
          ))}
      </TabsContent>
      <TabsContent
        value="archived"
        className="flex-1 border border-border rounded-lg p-2 overflow-y-auto  space-y-1 sm:space-y-2"
      >
        {notifications
          .filter((n) => n.isArchived)
          .map((notification) => (
            <NotificationCard
              key={notification.uuid}
              notification={notification}
              onArchive={() => onArchive(notification.uuid)}
              onUndoArchive={() => onUndoArchive(notification.uuid)}
              isPending={isPending}
            />
          ))}
      </TabsContent>
    </Tabs>
  );
};

export default NotificationList;
