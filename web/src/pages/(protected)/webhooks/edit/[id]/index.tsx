import { useNavigate, useParams } from "react-router";
import { WebhookFormFallback } from "../../_components/webhook-form/fallback";
import { ErrorBoundary } from "react-error-boundary";
import { WebhookForm } from "../../_components/webhook-form";
import { useWebhook } from "@/lib/api/webhooks";
import { WebhookFormLoading } from "../../_components/webhook-form/loading";

export default function EditWebhook() {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) return <WebhookFormFallback mode="edit" />;

  const { data: webhook, isLoading, isError } = useWebhook(id);

  if (isLoading) return <WebhookFormLoading mode="edit" />;

  if (isError) return <WebhookFormFallback mode="edit" />;

  const handleClose = () => {
    navigate("/webhooks");
  };

  return (
    <ErrorBoundary fallback={<WebhookFormFallback mode="edit" />}>
      <WebhookForm onCancel={handleClose} webhook={webhook} />
    </ErrorBoundary>
  );
}
