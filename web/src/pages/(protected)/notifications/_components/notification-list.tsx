import { useNotifications } from "@/lib/api/notificaitons";
import NotificationCard from "./notification-card";

const NotificationList = () => {
  const { data: notifications, isLoading, error } = useNotifications();

  if (isLoading)
    return (
      <ul className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4">
        <li>Loading notifications...</li>
      </ul>
    );

  if (error) return <div>Error loading notifications</div>;

  if (!notifications) return <div>No notifications found</div>;

  return (
    <ul className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4">
      {notifications.map((notification) => (
        <NotificationCard key={notification.uuid} notification={notification} />
      ))}
    </ul>
  );
};

export default NotificationList;
