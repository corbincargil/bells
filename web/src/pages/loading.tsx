const Loading = () => {
  return (
    <div className="min-h-40 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <div className="animate-pulse">
            <span className="text-4xl">📢</span>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping"></div>
        </div>

        <p className="text-muted-foreground text-sm font-playful animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
