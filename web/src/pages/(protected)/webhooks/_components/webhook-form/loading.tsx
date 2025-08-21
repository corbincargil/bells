interface WebhookFormLoadingProps {
  mode: "create" | "edit";
}

export const WebhookFormLoading = ({ mode }: WebhookFormLoadingProps) => {
  return (
    <div className="h-full max-h-[90vh] flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 pt-0 md:pt-4 border-b border-border">
        <h2 className="text-foreground font-semibold text-md sm:text-lg">
          {mode === "create" ? "Create Webhook" : "Edit Webhook"}
        </h2>
      </div>

      <div className="overflow-y-auto p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start gap-8">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-16 bg-muted-foreground/20 rounded animate-pulse" />
              <div className="h-10 bg-muted-foreground/20 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted-foreground/20 rounded animate-pulse" />
              <div className="h-6 w-12 bg-muted-foreground/20 rounded animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-10 bg-muted-foreground/20 rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-10 bg-muted-foreground/20 rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-36 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-10 bg-muted-foreground/20 rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-24 bg-muted-foreground/20 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="bg-muted/10 pt-2 pb-6 sm:py-6 px-4 sm:px-6 border-t border-border">
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between">
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <div className="h-10 w-full sm:w-20 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-10 w-full sm:w-16 bg-muted-foreground/20 rounded animate-pulse" />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <div className="h-10 w-full sm:w-32 bg-muted-foreground/20 rounded animate-pulse" />
            <div className="h-10 w-full sm:w-20 bg-muted-foreground/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
