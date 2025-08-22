export const NotificationListLoading = () => {
  return (
    <div className="space-y-4 w-full flex-1 border border-border rounded-lg p-2">
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
