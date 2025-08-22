import NotificationCard from "../notification-card";
import type { NotificationWithWebhook } from "@/types/notification";

const NotificationList = ({
  notifications,
}: {
  notifications: NotificationWithWebhook[] | undefined;
}) => {
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
    <>
      {notifications.map((n) => (
        <NotificationCard key={n.uuid} notification={n} />
      ))}
    </>
  );
};

export default NotificationList;
