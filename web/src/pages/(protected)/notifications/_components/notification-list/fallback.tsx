import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/router";
import { useNavigate } from "react-router";

export const NotificationListFallback = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 flex flex-col items-center h-full w-full border border-border rounded-lg">
      <h1 className="mt-12 text-md font-semibold">Oh no!</h1>
      <p className="text-sm text-muted-foreground text-center">
        An error occurred while loading your notifications 😢
      </p>
      <Button
        onClick={() => navigate(AppRoutes.HOME)}
        variant="primary"
        className="mt-4"
      >
        Go Home
      </Button>
    </div>
  );
};
