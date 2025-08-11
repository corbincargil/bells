import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

export const CreateWebhookButton = () => {
  const navigate = useNavigate();

  const onButtonClick = () => {
    navigate("/webhooks/create");
  };

  return (
    <Button onClick={onButtonClick}>
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        <span>Create Webhook</span>
      </div>
    </Button>
  );
};
