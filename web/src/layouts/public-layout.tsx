import NavBar from "@/components/nav-bar";
import { NotificationManagerIcon } from "@/components/nav-bar/notification-manager-icon";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/clerk-react";
import { Link, Outlet } from "react-router";

const RootLayout = () => {
  const MAX_WIDTH = "max-w-5xl";
  return (
    <>
      <div className="min-h-screen text-foreground bg-background flex flex-col">
        <header className="bg-background shadow-sm border-b border-border">
          <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", MAX_WIDTH)}>
            <div className="flex justify-between items-center h-16">
              <div className="flex gap-6 items-center">
                <Link to="/">
                  <h1 className="text-3xl font-bold text-foreground font-brand">
                    Honk
                  </h1>
                </Link>
                <SignedIn>
                  <NotificationManagerIcon />
                </SignedIn>
              </div>
              <NavBar />
            </div>
          </div>
        </header>

        <main
          className={cn(
            "flex-1 mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden overflow-y-scroll",
            MAX_WIDTH
          )}
        >
          <Outlet />
        </main>

        <footer className="bg-background border-t border-border sticky bottom-0 z-10">
          <div className={cn("mx-auto px-4 pt-2 pb-6", MAX_WIDTH)}>
            <p className="text-center text-foreground text-sm">
              <a href="https://github.com/corbincargil/honk">
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
