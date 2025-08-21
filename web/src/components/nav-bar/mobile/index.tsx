import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import type { NavLinkType } from "../types";
import { Link, useLocation } from "react-router";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";

const MobileNavBar = ({
  links,
  className,
}: {
  links: NavLinkType[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <div className={className}>
      <Drawer
        direction="top"
        container={document.getElementById("root")}
        open={open}
        onOpenChange={setOpen}
        autoFocus
      >
        <DrawerTrigger className="w-12 h-12 cursor-pointer rounded-lg hover:text-primary dark:hover:bg-accent/50 transition-all">
          <Menu size={32} className="mx-auto h-full" />
        </DrawerTrigger>
        <DrawerContent>
          <DialogTitle className="sr-only">Mobile nav bar</DialogTitle>
          <DialogDescription className="sr-only">
            Navigate on mobile
          </DialogDescription>
          <nav className="flex flex-col items-center">
            {links.map((l) => (
              <Link
                key={l.link}
                to={l.link}
                onClick={() => setOpen(false)}
                className={cn(
                  "w-full h-16 flex items-center justify-center px-3 py-2 text-foreground font-semibold text-lg rounded-b-md border-t border-border hover:bg-muted/10 hover:text-primary transition-all",
                  location.pathname === l.link && "text-primary"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileNavBar;
