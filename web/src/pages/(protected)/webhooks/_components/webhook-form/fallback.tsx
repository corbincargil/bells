import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/router";
import { useNavigate } from "react-router";

interface WebhookFormFallbackProps {
  mode: "create" | "edit";
}

export const WebhookFormFallback = ({ mode }: WebhookFormFallbackProps) => {
  const navigate = useNavigate();
  return (
    <div className="h-full max-h-[90vh] flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {mode === "create" ? "Create Webhook" : "Edit Webhook"}
        </h2>
      </div>

      <div className="p-4 flex flex-col items-center h-full w-full">
        <h1 className="mt-12 text-md font-semibold text-foreground font-playful">
          Oh no!
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          An error occurred while loading the form 😢
        </p>
        <Button
          onClick={() => navigate(AppRoutes.WEBHOOKS)}
          className="mt-4 font-playful"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};
