import type { Notification } from "@/types/notification";

const NotificationCard = ({ notification }: { notification: Notification }) => {
  return (
    <div className="flex flex-col gap-2 hover:bg-foreground/10 p-4 rounded-md transition-colors duration-300">
      <h3 className="text-lg font-bold">{notification.title}</h3>
      <p className="text-sm text-gray-500">{notification.message}</p>
    </div>
  );
};

export default NotificationCard;
