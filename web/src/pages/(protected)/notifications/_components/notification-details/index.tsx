import { useEffect } from "react";
import { Link } from "react-router";
import type { NotificationWithWebhook } from "@/types/notification";
import dateFormatters from "@/lib/date-formatters";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Clock, MailOpen, LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useDeleteNotification,
  usePatchArchiveStatus,
  usePatchReadStatus,
} from "@/lib/api/notificaitons";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteNotificationButton } from "../notification-list/delete-notification-button";

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
  const { mutate: patchArchiveStatus } = usePatchArchiveStatus();
  const { mutate: deleteNotification, isPending: isDeleting } =
    useDeleteNotification();

  const handleMarkAsRead = () => {
    if (notification.isRead) return;
    patchReadStatus(
      { notificationId: notification.uuid, isRead: true },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["notification"] });
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
          queryClient.invalidateQueries({ queryKey: ["notification"] });
        },
      }
    );
  };

  const handleArchive = () => {
    patchArchiveStatus(
      { notificationId: notification.uuid, isArchived: true },
      {
        onSuccess: () => {
          toast.success("Notification archived successfully");
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["notification"] });
        },
        onError: (e) => {
          toast.error(`Failed to archive notification: ${e.message}`);
        },
      }
    );
  };

  const handleUnarchive = () => {
    patchArchiveStatus(
      { notificationId: notification.uuid, isArchived: false },
      {
        onSuccess: () => {
          toast.success("Notification unarchived successfully");
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({ queryKey: ["notification"] });
        },
        onError: (e) => {
          toast.error(`Failed to unarchive notification: ${e.message}`);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteNotification(notification.uuid, {
      onSuccess: () => {
        toast.success("Notification deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        onClose();
      },
      onError: (e) => {
        toast.error(`Failed to delete notification: ${e.message}`);
      },
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleMarkAsRead();
    }, 3500);
    return () => {
      clearTimeout(timeout);
    };
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
                {dateFormatters.relativeTime(notification.createdAt)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Updated
              </label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {dateFormatters.relativeTime(notification.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="bg-muted/10 p-4 sm:p-6 border-t border-border">
        <div className="flex gap-3 justify-between">
          <div className="flex gap-3">
            <DeleteNotificationButton
              onDelete={handleDelete}
              isPending={isDeleting}
            />
            {notification.isArchived ? (
              <Button
                type="button"
                variant="secondary"
                onClick={handleUnarchive}
                disabled={!notification.isArchived}
                className="flex items-center gap-2"
              >
                Restore
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={handleArchive}
                disabled={notification.isArchived}
                className="flex items-center gap-2"
              >
                Archive
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {notification.isRead ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleMarkAsUnread}
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Mark Unread
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={handleMarkAsRead}
                className="flex items-center gap-2"
              >
                <MailOpen className="w-4 h-4" />
                Mark Read
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
