import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import type { NavLink } from "../types";

const MobileNavBar = ({
  links,
  className,
}: {
  links: NavLink[];
  className?: string;
}) => {
  return (
    <div className={className}>
      <Drawer direction="top">
        <DrawerTrigger className="w-12 h-12 cursor-pointer">
          <Menu size={32} className="mx-auto h-full" />
        </DrawerTrigger>
        <DrawerContent>
          <nav className="flex flex-col items-center">
            {links.map((l) => (
              <a
                key={l.link}
                href={l.link}
                className="m-1 text-foreground hover:text-primary px-3 py-2 rounded-md text-lg font-semibold transition-all"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileNavBar;
