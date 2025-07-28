import { AppRoutes } from "@/router";
import { SignUp as ClerkSignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router";

const SignIn = () => {
  return (
    <>
      <SignedOut>
        <ClerkSignUp forceRedirectUrl={AppRoutes.ROOT} />
      </SignedOut>
      <SignedIn>
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="bg-background border border-border rounded-lg p-8 shadow-sm max-w-md w-full">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Welcome back!
              </h2>
              <p className="text-muted-foreground">
                You are already signed in.
              </p>
              <Link
                to="/"
                className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default SignIn;
