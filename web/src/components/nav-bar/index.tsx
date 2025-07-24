import MobileNavBar from "./mobile";
import NavItem from "./nav-item";
import { links } from "./types";

const NavBar = () => {
  return (
    <>
      <nav className="hidden sm:flex">
        {links.map((l) => (
          <NavItem item={l} />
        ))}
      </nav>
      <MobileNavBar links={links} className="block sm:hidden" />
    </>
  );
};

export default NavBar;
