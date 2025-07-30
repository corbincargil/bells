import type { NavLink } from "./types";
import { Link } from "react-router";

const NavItem = ({ item }: { item: NavLink }) => {
  return (
    <Link
      key={item.link}
      to={item.link}
      className=" my-auto px-3 py-2 text-foreground hover:text-primary rounded-md text-lg font-semibold transition-all"
    >
      {item.label}
    </Link>
  );
};

export default NavItem;
