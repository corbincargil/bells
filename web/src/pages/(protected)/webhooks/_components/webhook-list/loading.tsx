export const WebhookListLoading = () => {
  return (
    <div className="flex-1 border border-border rounded-lg p-2 overflow-y-auto space-y-1 sm:space-y-2">
      <div className="animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="m-3 h-24 bg-muted border border-border rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};
