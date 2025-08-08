import NavBar from "@/components/nav-bar";
import { Outlet } from "react-router";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { AppRoutes } from "@/router";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "@/components/error/global-error-fallback";

const RootLayout = () => {
  const MAX_WIDTH = "max-w-7xl";
  return (
    <>
      <SignedIn>
        <div className="h-screen text-foreground bg-background flex flex-col">
          <header className="bg-background shadow-sm border-b border-border">
            <div className={`${MAX_WIDTH} mx-auto px-4 sm:px-6 lg:px-8`}>
              <div className="flex justify-between items-center h-16">
                <h1 className="text-3xl font-bold text-foreground">Bells</h1>
                <NavBar />
              </div>
            </div>
          </header>

          <main
            className={`flex-1 ${MAX_WIDTH} w-full mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-8 overflow-hidden`}
          >
            <ErrorBoundary fallback={<GlobalErrorFallback />}>
              <Outlet />
            </ErrorBoundary>
          </main>

          <footer className="bg-background border-t border-border">
            <div
              className={`${MAX_WIDTH} mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4`}
            >
              <p className="text-center text-foreground text-sm">
                <a href="https://github.com/corbincargil/bells">
                  &copy; 2025 Bells App
                </a>
              </p>
            </div>
          </footer>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl={AppRoutes.SIGN_IN} />
      </SignedOut>
    </>
  );
};

export default RootLayout;
