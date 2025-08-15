import type { Subscription } from "@/types/subscription";
import { cn } from "@/lib/utils";
import { Monitor, Smartphone, Laptop } from "lucide-react";

export const SubscriptionCard = ({
  subscription,
  isCurrentDevice,
}: {
  subscription: Subscription;
  isCurrentDevice?: boolean;
}) => {
  const getDeviceIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "ios":
      case "android":
        return <Smartphone className="w-4 h-4" />;
      case "macos":
      case "windows":
      case "linux":
        return <Laptop className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={cn(
        "group w-full flex items-center gap-3 bg-card border border-border rounded-lg p-4 hover:bg-accent/50 hover:shadow-sm transition-all duration-200",
        isCurrentDevice && "ring-2 ring-primary/20 bg-primary/5"
      )}
    >
      <div className="flex flex-col w-full gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          {getDeviceIcon(subscription.platform)}
          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {subscription.deviceName}
            {isCurrentDevice && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                Current Device
              </span>
            )}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {subscription.browser} on {subscription.platform}
        </p>
        <div className="flex items-center justify-between pt-2">
          <time className="text-xs text-muted-foreground">
            Last used:{" "}
            {subscription.lastUsed
              ? new Date(subscription.lastUsed).toLocaleDateString()
              : "Never"}
          </time>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                subscription.isActive ? "bg-green-400" : "bg-red-400"
              )}
            />
            <span className="text-xs text-muted-foreground">
              {subscription.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
