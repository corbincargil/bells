import type { NavLink } from "./types";

const NavItem = ({ item }: { item: NavLink }) => {
  return (
    <a
      key={item.link}
      href={item.link}
      className="m-1 text-foreground hover:text-primary px-3 py-2 rounded-md text-lg font-semibold transition-all"
    >
      {item.label}
    </a>
  );
};

export default NavItem;
