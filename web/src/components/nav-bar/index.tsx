import { AppRoutes } from "@/router";
import MobileNavBar from "./mobile";
import NavItem from "./nav-item";
import { links } from "./types";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { NotificationManagerIcon } from "./notification-manager-icon";
import { cn } from "@/lib/utils";

/** Same header used for both public and protected routes */
const NavBar = ({ width }: { width: string }) => {
  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", width)}>
        <div className="flex justify-between items-center h-16">
          <div className="flex gap-6 items-center">
            <Link to="/">
              <h1 className="text-3xl font-bold text-foreground font-brand">
                Honk
              </h1>
            </Link>
            <NotificationManagerIcon />
          </div>
          <div className="flex items-center justify-between">
            <SignedIn>
              <nav className="hidden sm:flex">
                {links.map((l) => (
                  <NavItem key={l.link} item={l} />
                ))}
              </nav>
              <MobileNavBar
                links={links}
                className="sm:hidden flex items-center"
              />
              <div key="user-button" className="px-3 flex items-center">
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <NavItem item={{ link: AppRoutes.HOME, label: "Home" }} />
              <div key="sign-in-button" className="px-3 flex items-center">
                <Link to={AppRoutes.SIGN_IN}>
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
