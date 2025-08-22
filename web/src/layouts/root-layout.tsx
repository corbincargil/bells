import NavBar from "@/components/nav-bar";
import { Outlet } from "react-router";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { AppRoutes } from "@/router";
import { ErrorBoundary } from "react-error-boundary";
import { PageLevelFallback } from "@/components/error/page-level-fallback";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import registerServiceWorker from "@/lib/register-sw";
import { PushNotificationProvider } from "@/contexts/push-notification-context";
import { DevelopmentBanner } from "@/components/banners/development-banner";
import { cn } from "@/lib/utils";

const RootLayout = () => {
  const MAX_WIDTH = "max-w-5xl";
  const isDev = import.meta.env.VITE_ENV === "development";

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <>
      <SignedIn>
        <PushNotificationProvider>
          <div className="h-screen text-foreground bg-background flex flex-col">
            <NavBar width={MAX_WIDTH} />
            {isDev && <DevelopmentBanner />}

            <main
              className={cn(
                "flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-8 overflow-hidden overflow-y-scroll",
                MAX_WIDTH
              )}
            >
              <ErrorBoundary fallback={<PageLevelFallback />}>
                <Outlet />
              </ErrorBoundary>
            </main>
            <Toaster expand richColors position="top-right" />

            <footer className="bg-background border-t border-border">
              <div className={cn("mx-auto pb-6 py-4 sm:py-6", MAX_WIDTH)}>
                <p className="text-center text-foreground text-sm">
                  <a href="https://github.com/corbincargil/honk">
                    &copy; 2025 Honk App
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </PushNotificationProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl={AppRoutes.SIGN_IN} />
      </SignedOut>
    </>
  );
};

export default RootLayout;
