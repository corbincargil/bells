import { usePushNotificationContext } from "@/contexts/push-notification-context";
import { Button } from "../ui/button";
import { useState } from "react";
import { X } from "lucide-react";

export const NotificationStatusBanner = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { permission, requestPermission, clearRequestedPermission } =
    usePushNotificationContext();

  if (permission === "granted" || !isOpen) {
    return null;
  }

  return (
    <div className="my-2 bg-accent/50 border rounded-lg p-4 flex gap-2 items-center justify-between">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
        <X
          className="w-4 h-4 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      </Button>
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
