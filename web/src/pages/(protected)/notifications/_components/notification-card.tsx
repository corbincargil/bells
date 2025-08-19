import type { NotificationWithWebhook } from "@/types/notification";
import { DeleteNotificationButton } from "./notification-list/delete-notification-button";
import { Link, useSearchParams } from "react-router";
import dateFormatters from "@/lib/date-formatters";

const NotificationCard = ({
  notification,
  onDelete,
  isPending,
}: {
  notification: NotificationWithWebhook;
  onDelete: () => void;
  isPending: boolean;
}) => {
  const [searchParams] = useSearchParams();

  const route = () => {
    const base = `/notifications/details/${notification.uuid}`;
    const tab = searchParams.get("tab");
    if (tab && tab !== "primary") {
      return `${base}?tab=${tab}`;
    }
    return base;
  };

  return (
    <Link
      className="group w-full flex items-start gap-3 bg-card border border-border cursor-pointer rounded-lg p-4 hover:bg-accent/50 hover:shadow-sm transition-all duration-200"
      to={route()}
    >
      {!notification.isRead ? (
        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
      ) : (
        <div className="w-2 h-2 bg-background rounded-full mt-2 flex-shrink-0" />
      )}
      <div className="flex flex-col w-full gap-1 sm:gap-2">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {notification.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <div className="flex items-center justify-between pt-2">
          <time className="text-xs text-muted-foreground">
            {dateFormatters.relativeTime(notification.createdAt)}
          </time>
          <span className="text-xs text-muted-foreground">
            {notification.webhookName}
          </span>
        </div>
      </div>
      <div className="self-center">
        <DeleteNotificationButton onDelete={onDelete} isPending={isPending} />
      </div>
    </Link>
  );
};

export default NotificationCard;
