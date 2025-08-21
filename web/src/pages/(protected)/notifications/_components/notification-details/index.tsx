import { useEffect } from "react";
import { Link } from "react-router";
import type { NotificationWithWebhook } from "@/types/notification";
import dateFormatters from "@/lib/date-formatters";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Calendar,
  Clock,
  MailOpen,
  LinkIcon,
  X,
  Archive,
  Undo2,
} from "lucide-react";
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
      <div className="flex items-center justify-between p-4 pt-0 md:pt-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Notification Details
        </h2>
        <div
          className={cn(
            "px-3 py-2 rounded-full text-xs font-medium",
            notification.isRead
              ? "bg-card text-muted-foreground"
              : "bg-primary/10 text-primary dark:bg-primary/90 dark:text-primary-foreground"
          )}
        >
          {notification.isRead ? "Read" : "Unread"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 space-y-4">
        {/* Notification Details Section */}
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Title
          </label>
          <div className="text-foreground text-sm text-wrap break-words max-h-[100px] dark:bg-input/30 p-3 rounded-md border overflow-y-auto">
            {notification.title}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Message
          </label>
          <div className="text-foreground text-sm text-wrap break-words max-h-[200px] dark:bg-input/30 p-3 rounded-md border overflow-y-auto">
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
        <div className="grid grid-cols-2 gap-4">
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

        {/* Actions Section */}
        <div className="bg-muted/10 pt-2 pb-6 sm:py-6 border-t border-border">
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
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
                  <Undo2 className="w-4 h-4" />
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
                  <Archive className="w-4 h-4" />
                  Archive
                </Button>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {notification.isRead ? (
                <Button
                  type="button"
                  onClick={handleMarkAsUnread}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Mark Unread
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleMarkAsRead}
                  className="flex items-center gap-2"
                >
                  <MailOpen className="w-4 h-4" />
                  Mark Read
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="w-4 h-4 sm:hidden" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;
