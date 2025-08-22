import { Button } from "@/components/ui/button";

export const PageLevelFallback = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[50vh] text-center space-y-6 px-4">
      <div className="text-6xl animate-bounce">😢</div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground font-playful">
          Something went wrong!
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Don't worry, it's not you—our app had a little hiccup. Try refreshing
          the page or give it a moment to recover.
        </p>
      </div>

      <Button onClick={handleReload} className="font-playful">
        🔄 Refresh Page
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        If this keeps happening, maybe blame the webhooks? 🤷‍♂️
      </p>
    </div>
  );
};
