import { AppRoutes } from "@/router";
import MobileNavBar from "./mobile";
import NavItem from "./nav-item";
import { links } from "./types";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";
import { Link } from "react-router";

const NavBar = () => {
  return (
    <div className="flex items-center justify-between">
      <SignedIn>
        <nav className="hidden sm:flex">
          {links.map((l) => (
            <NavItem key={l.link} item={l} />
          ))}
        </nav>
        <MobileNavBar links={links} className="sm:hidden flex items-center" />
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
  );
};

export default NavBar;
