import MobileNavBar from "./mobile";
import NavItem from "./nav-item";
import { links } from "./types";
import { UserButton } from "@clerk/clerk-react";

const NavBar = () => {
  return (
    <>
      <nav className="hidden sm:flex">
        {links.map((l) => (
          <NavItem key={l.link} item={l} />
        ))}
        <div key="user-button" className="px-3 flex items-center">
          <UserButton />
        </div>
      </nav>
      <MobileNavBar links={links} className="block sm:hidden" />
    </>
  );
};

export default NavBar;
