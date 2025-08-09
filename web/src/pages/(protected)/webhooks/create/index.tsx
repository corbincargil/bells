import { useNavigate } from "react-router";
import { WebhookForm } from "../_components/webhook-form";

export default function WebhooksCreate() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/webhooks");
  };

  return <WebhookForm onCancel={handleClose} />;
}
