import NavBar from "@/components/nav-bar";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="min-h-screen text-foreground bg-background flex flex-col">
      <header className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-3xl font-bold text-foreground">Bells</h1>
            <NavBar />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-foreground text-sm">
            <a href="https://github.com/corbincargil/bells">
              &copy; 2025 Bells App
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
