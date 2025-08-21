import { Outlet } from "react-router";

const RootLayout = () => {
  const MAX_WIDTH = "max-w-5xl";
  return (
    <>
      <div className="min-h-screen text-foreground bg-background flex flex-col">
        <header className="bg-background shadow-sm border-b border-border">
          <div className={`${MAX_WIDTH} mx-auto px-4 sm:px-6 lg:px-8`}>
            <div className="flex justify-between items-center h-16">
              <h1 className="text-3xl font-bold text-foreground font-brand">
                Honk
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>

        <footer className="bg-background border-t border-border">
          <div className={`${MAX_WIDTH} mx-auto px-4 pt-2 pb-6`}>
            <p className="text-center text-foreground text-sm">
              <a href="https://github.com/corbincargil/bells">
                &copy; 2025 Honk App
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default RootLayout;
