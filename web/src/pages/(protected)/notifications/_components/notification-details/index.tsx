import { useEffect } from "react";
import { Link } from "react-router";
import type { NotificationWithWebhook } from "@/types/notification";
import dateFormatters from "@/lib/date-formatters";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Mail,
  Calendar,
  Clock,
  MailOpen,
  LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePatchReadStatus } from "@/lib/api/notificaitons";
import { useQueryClient } from "@tanstack/react-query";

interface NotificationDetailsProps {
  notification: NotificationWithWebhook;
  onClose: () => void;
}

export const NotificationDetails = ({
  notification,
  onClose,
}: NotificationDetailsProps) => {
  const queryClient = useQueryClient();
  const { mutate: patchReadStatus } = usePatchReadStatus();

  const handleMarkAsRead = () => {
    if (notification.isRead) return;
    patchReadStatus(
      { notificationId: notification.uuid, isRead: true },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          notification.isRead = true;
        },
      }
    );
  };

  const handleMarkAsUnread = () => {
    if (!notification.isRead) return;
    patchReadStatus(
      { notificationId: notification.uuid, isRead: false },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          notification.isRead = false;
        },
      }
    );
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete notification:", notification.uuid);
  };

  useEffect(() => {
    setTimeout(() => {
      handleMarkAsRead();
    }, 2000);
  }, []);

  return (
    <div className="max-h-[90vh] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Notification Details
        </h2>
        <div
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            notification.isRead
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary dark:bg-primary/90 dark:text-primary-foreground"
          )}
        >
          {notification.isRead ? "Read" : "Unread"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Notification Details Section */}
        <div className="bg-muted/20 p-4 rounded-lg border space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Title
            </label>
            <div className="text-foreground text-sm dark:bg-input/30 p-3 rounded-md border">
              {notification.title}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Message
            </label>
            <div className="text-foreground text-sm dark:bg-input/30 p-3 rounded-md border">
              {notification.message}
            </div>
          </div>

          {/* Webhook */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Triggered by
            </label>
            {notification.webhookUuid ? (
              <Link
                to={`/webhooks/edit/${notification.webhookUuid}`}
                className="text-foreground text-sm p-3 cursor-pointer hover:underline hover:text-primary transition-all duration-300 flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                {notification.webhookName ?? "No webhook"}
              </Link>
            ) : (
              <div className="text-foreground text-sm p-3">N/A</div>
            )}
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Created
              </label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {dateFormatters.fullDateTime(notification.createdAt)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Updated
              </label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {dateFormatters.fullDateTime(notification.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="bg-muted/10 p-4 sm:p-6 border-t border-border">
        <div className="flex gap-3 justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <div className="flex gap-3">
            {notification.isRead ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleMarkAsUnread}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Mark as Unread
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleMarkAsRead}
                className="flex items-center gap-2"
              >
                <MailOpen className="w-4 h-4" />
                Mark as Read
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;
