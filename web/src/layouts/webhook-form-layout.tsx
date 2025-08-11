import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export const WebhookFormLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isDrawerActive =
    location.pathname.includes("/create") ||
    location.pathname.includes("/edit");

  const onOpenChange = (open: boolean) => {
    if (!open) {
      navigate("/webhooks");
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Drawer
      open={isDrawerActive}
      direction={isMobile ? "bottom" : "right"}
      container={document.getElementById("root")}
      onOpenChange={onOpenChange}
      autoFocus
    >
      <DrawerContent className="md:!w-[600px] md:!max-w-[600px]">
        <DrawerTitle className="sr-only">Webhook Form Layout</DrawerTitle>
        <DrawerDescription className="sr-only">
          Webhook Form Layout
        </DrawerDescription>
        <Outlet />
      </DrawerContent>
    </Drawer>
  );
};
