import { Check, BellIcon as LucideBellIcon } from "lucide-react";
import { Button } from "../ui/button";
import { usePushNotificationContext } from "@/contexts/push-notification-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { toast } from "sonner";

export const NotificationManagerIcon = () => {
  const {
    permission,
    requestPermission,
    clearRequestedPermission,
    hasRequestedPermission,
  } = usePushNotificationContext();

  const onRetry = () => {
    clearRequestedPermission();
    requestPermission();
  };

  useEffect(() => {
    if (permission !== "granted" && !hasRequestedPermission()) {
      setTimeout(() => {
        toast.info("Enable notifications?", {
          action: {
            label: "Enable",
            onClick: requestPermission,
          },
          duration: 10000,
          closeButton: true,
        });
      }, 5000);
    }
  }, [permission, hasRequestedPermission, requestPermission]);

  const root = document.getElementById("root");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative hover:text-primary">
          <LucideBellIcon className="!w-6 !h-6" />
          {permission === "granted" ? (
            <Check className="absolute -top-1 -right-1 bg-green-500 select-none text-white rounded-full w-4 h-4 text-sm font-bold flex items-center justify-center" />
          ) : (
            <span className="absolute -top-1 -right-1 bg-red-500 select-none text-white rounded-full w-4 h-4 text-sm font-bold flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        container={root ?? undefined}
        side="bottom"
        align="end"
      >
        <DropdownMenuLabel>
          Notifications: {permission === "granted" ? "Enabled" : "Disabled"}
        </DropdownMenuLabel>
        <p className="px-2 py-1.5 text-sm text-muted-foreground">
          {permission === "granted"
            ? "You are subscribed to notifications"
            : "Retry to enable notifications"}
        </p>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRetry} disabled={permission === "granted"}>
          {hasRequestedPermission() ? "Retry" : "Enable"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
