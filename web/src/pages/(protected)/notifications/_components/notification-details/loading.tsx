export const NotificationDetailsLoading = () => {
  return (
    <div className="max-h-[90vh] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Notification Details
        </h2>
        <div className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
          <div className="h-3 w-12 bg-muted-foreground/20 rounded animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Notification Details Section */}
        <div className="bg-muted/20 p-4 rounded-lg border space-y-4">
          {/* Title */}
          <div>
            <div className="h-4 w-8 bg-muted rounded animate-pulse mb-2" />
            <div className="h-12 bg-muted rounded animate-pulse border" />
          </div>

          {/* Message */}
          <div>
            <div className="h-4 w-16 bg-muted rounded animate-pulse mb-2" />
            <div className="h-20 bg-muted rounded animate-pulse border" />
          </div>

          {/* Webhook */}
          <div>
            <div className="h-4 w-20 bg-muted rounded animate-pulse mb-2" />
            <div className="h-12 bg-muted rounded animate-pulse" />
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="h-4 w-14 bg-muted rounded animate-pulse mb-2" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div>
              <div className="h-4 w-16 bg-muted rounded animate-pulse mb-2" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="bg-muted/10 p-4 sm:p-6 border-t border-border">
        <div className="flex gap-3 justify-between">
          <div className="h-10 w-20 bg-muted rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
