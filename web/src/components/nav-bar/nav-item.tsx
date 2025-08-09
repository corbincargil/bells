import { cn } from "@/lib/utils";
import type { NavLink } from "./types";
import { Link, useLocation } from "react-router";

const NavItem = ({ item }: { item: NavLink }) => {
  const location = useLocation();
  const isActive = location.pathname === item.link;
  return (
    <Link
      key={item.link}
      to={item.link}
      className={cn(
        "my-auto px-3 py-2 text-foreground rounded-md text-lg font-semibold hover:text-primary hover:bg-muted/30 transition-all",
        isActive && "text-primary"
      )}
    >
      {item.label}
    </Link>
  );
};

export default NavItem;
