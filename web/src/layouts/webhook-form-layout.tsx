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

  const editMode = location.pathname.includes("/edit");
  const createMode = location.pathname.includes("/create");

  const isDrawerActive = editMode || createMode;

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
      handleOnly={!isMobile}
    >
      <DrawerContent className="md:!w-[600px] md:!max-w-[600px]">
        <DrawerTitle className="sr-only">
          {editMode ? "Edit Webhook" : "Create Webhook"}
        </DrawerTitle>
        <DrawerDescription className="sr-only">
          {editMode
            ? "Edit webhook details"
            : "Create a new webhook to receive notifications"}
        </DrawerDescription>
        <Outlet />
      </DrawerContent>
    </Drawer>
  );
};
