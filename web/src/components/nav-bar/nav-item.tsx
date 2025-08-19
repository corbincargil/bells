import { cn } from "@/lib/utils";
import type { NavLinkType } from "./types";
import { NavLink } from "react-router";

const NavItem = ({ item }: { item: NavLinkType }) => {
  return (
    <NavLink
      key={item.link}
      to={item.link}
      className={({ isActive }) =>
        cn(
          "my-auto px-3 py-2 text-foreground rounded-md text-lg font-semibold hover:text-primary hover:bg-muted/30 transition-all",
          isActive && "text-primary"
        )
      }
    >
      {item.label}
    </NavLink>
  );
};

export default NavItem;
