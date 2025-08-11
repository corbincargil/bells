import { useParams } from "react-router";

export default function EditWebhook() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-2xl text-foreground font-bold">Edit Webhook</h1>
      <p className="text-sm text-muted-foreground">{id}</p>
    </div>
  );
}
