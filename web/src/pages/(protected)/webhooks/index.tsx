import WebhookList from "./_components/webhook-list";

const Webhooks = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Webhooks
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your webhook integrations
        </p>
      </div>
      <WebhookList />
    </div>
  );
};

export default Webhooks;
