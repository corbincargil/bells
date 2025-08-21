import NavBar from "@/components/nav-bar";
import { Outlet } from "react-router";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { AppRoutes } from "@/router";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "@/components/error/global-error-fallback";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import registerServiceWorker from "@/lib/register-sw";
import { PushNotificationProvider } from "@/contexts/push-notification-context";
import { NotificationManagerIcon } from "@/components/nav-bar/notification-manager-icon";
import { DevelopmentBanner } from "@/components/banners/development-banner";

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
            <header className="bg-background shadow-sm border-b border-border">
              <div className={`${MAX_WIDTH} mx-auto px-4 sm:px-6 lg:px-8`}>
                <div className="flex justify-between items-center h-16">
                  <div className="flex gap-6 items-center">
                    <h1 className="text-3xl font-bold text-foreground font-brand">
                      Honk
                    </h1>
                    <NotificationManagerIcon />
                  </div>
                  <NavBar />
                </div>
              </div>
            </header>
            {isDev && <DevelopmentBanner />}

            <main
              className={`flex-1 ${MAX_WIDTH} w-full mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-8 overflow-hidden`}
            >
              <ErrorBoundary fallback={<GlobalErrorFallback />}>
                <Outlet />
              </ErrorBoundary>
            </main>
            <Toaster expand richColors position="top-right" />

            <footer className="bg-background border-t border-border">
              <div className={`${MAX_WIDTH} mx-auto pb-6 py-4 sm:py-6`}>
                <p className="text-center text-foreground text-sm">
                  <a href="https://github.com/corbincargil/bells">
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
