import type { NavLink } from "./types";

const NavItem = ({ item }: { item: NavLink }) => {
  return (
    <a
      key={item.link}
      href={item.link}
      className=" my-auto px-3 py-2 text-foreground hover:text-primary rounded-md text-lg font-semibold transition-all"
    >
      {item.label}
    </a>
  );
};

export default NavItem;
