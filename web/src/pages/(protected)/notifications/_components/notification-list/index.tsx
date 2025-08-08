import { useNotifications } from "@/lib/api/notificaitons";
import NotificationCard from "../notification-card";
import { NotificationListLoading } from "./loading";
import { NotificationListFallback } from "./fallback";

const NotificationList = () => {
  const { data: notifications, isLoading, error } = useNotifications();

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
    <div className="flex-1 border border-border rounded-lg p-2 overflow-y-auto space-y-1 sm:space-y-2">
      {notifications.map((notification) => (
        <NotificationCard key={notification.uuid} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationList;
