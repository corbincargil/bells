import { useNavigate } from "react-router";
import { WebhookForm } from "../_components/webhook-form";
import { WebhookFormFallback } from "../_components/webhook-form/fallback";
import { ErrorBoundary } from "react-error-boundary";

export default function CreateWebhook() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/webhooks");
  };

  return (
    <ErrorBoundary fallback={<WebhookFormFallback mode="create" />}>
      <WebhookForm onCancel={handleClose} />
    </ErrorBoundary>
  );
}
