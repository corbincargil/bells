interface WebhookFormLoadingProps {
  mode: "create" | "edit";
}

export const WebhookFormLoading = ({ mode }: WebhookFormLoadingProps) => {
  return (
    <div className="h-full max-h-[90vh] flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <h2 className="text-foreground font-semibold text-lg">
          {mode === "create" ? "Create Webhook" : "Edit Webhook"}
        </h2>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start gap-8">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-6 w-12 bg-muted rounded animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-36 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-24 bg-muted rounded animate-pulse" />
          </div>

          <div className="flex gap-3 pt-4">
            <div className="flex-1 h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 w-20 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
