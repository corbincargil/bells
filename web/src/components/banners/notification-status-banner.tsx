import { usePushNotificationContext } from "@/contexts/push-notification-context";
import { Button } from "../ui/button";

export const NotificationStatusBanner = () => {
  const { permission, requestPermission, clearRequestedPermission } =
    usePushNotificationContext();

  if (permission === "granted") {
    return null;
  }

  return (
    <div className="my-2 bg-accent/50 border rounded-lg p-4 flex items-center justify-between">
      <div>
        <span className="font-medium">Notifications are off. </span>
        <span className="text-muted-foreground">
          Enable notifications to receive alerts.
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          clearRequestedPermission();
          requestPermission();
        }}
      >
        Enable
      </Button>
    </div>
  );
};
