export const AppLevelFallback = () => (
  <div className="min-h-screen bg-background text-foreground flex flex-col">
    <header className="bg-background shadow-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: '"Sour Gummy", cursive, sans-serif' }}
          >
            Honk
          </h1>
        </div>
      </div>
    </header>

    <main className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl animate-bounce">😱</div>

        <div className="space-y-2">
          <h2
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: '"Sour Gummy", cursive, sans-serif' }}
          >
            Something Broke!
          </h2>
          <p className="text-muted-foreground">
            The entire app crashed—probably a catastrophic failure. Don't worry,
            it's likely not your fault!
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
          style={{ fontFamily: '"Sour Gummy", cursive, sans-serif' }}
        >
          🔄 Refresh Page
        </button>

        <p className="text-xs text-muted-foreground">
          If this keeps happening, definitely blame the webhooks 🤷‍♂️
        </p>
      </div>
    </main>

    <footer className="bg-background border-t border-border">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <p className="text-center text-foreground text-sm">
          <a href="https://github.com/corbincargil/honk">
            &copy; 2025 Honk App
          </a>
        </p>
      </div>
    </footer>
  </div>
);
