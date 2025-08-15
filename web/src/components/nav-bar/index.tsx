import MobileNavBar from "./mobile";
import NavItem from "./nav-item";
import { links } from "./types";
import { UserButton } from "@clerk/clerk-react";
import { NotificationManagerIcon } from "./notification-manager-icon";

const NavBar = () => {
  return (
    <div className="flex items-center justify-between">
      <nav className="hidden sm:flex">
        {links.map((l) => (
          <NavItem key={l.link} item={l} />
        ))}
      </nav>
      <MobileNavBar links={links} className="sm:hidden flex items-center" />
      <div className="px-3 flex items-center">
        <NotificationManagerIcon />
      </div>
      <div key="user-button" className="px-3 flex items-center">
        <UserButton />
      </div>
    </div>
  );
};

export default NavBar;
