import { usePatchArchiveStatus } from "@/lib/api/notificaitons";
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import NotificationCard from "../notification-card";
import type { NotificationWithWebhook } from "@/types/notification";

const NotificationList = ({
  notifications,
  queryClient,
}: {
  notifications: NotificationWithWebhook[] | undefined;
  queryClient: QueryClient;
}) => {
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
        <NotificationCard
          key={n.uuid}
          notification={n}
          onArchive={() => onArchive(n.uuid)}
          onUndoArchive={() => onUndoArchive(n.uuid)}
          isPending={isPending}
        />
      ))}
    </>
  );
};

export default NotificationList;
