import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/router";
import { useNavigate } from "react-router";

export const NotificationDetailsFallback = () => {
  const navigate = useNavigate();

  return (
    <div className="max-h-[90vh] flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Notification Details
        </h2>
      </div>

      <div className="p-4 flex flex-col items-center h-full w-full">
        <h1 className="mt-12 text-md font-semibold text-foreground">Oh no!</h1>
        <p className="text-sm text-muted-foreground text-center">
          An error occurred while loading the notification details 😢
        </p>
        <Button
          onClick={() => navigate(AppRoutes.NOTIFICATIONS)}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};
