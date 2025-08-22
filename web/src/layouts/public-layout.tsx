import NavBar from "@/components/nav-bar";
import { PushNotificationProvider } from "@/contexts/push-notification-context";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

const PublicLayout = () => {
  const MAX_WIDTH = "max-w-5xl";
  return (
    <PushNotificationProvider>
      <div className="min-h-screen text-foreground bg-background flex flex-col">
        <NavBar width={MAX_WIDTH} />

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
    </PushNotificationProvider>
  );
};

export default PublicLayout;
