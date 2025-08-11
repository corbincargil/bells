import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export const CreateWebhookButton = () => {
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isCreateActive = location.pathname.includes("/create");

  const onButtonClick = () => {
    if (isCreateActive) return;
    navigate("/webhooks/create");
  };

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
      open={isCreateActive}
      direction={isMobile ? "bottom" : "right"}
      container={document.getElementById("root")}
      onOpenChange={onOpenChange}
      autoFocus
    >
      <DrawerTrigger asChild>
        <Button onClick={onButtonClick}>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Create Webhook</span>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="md:!w-[600px] md:!max-w-[600px]">
        <DrawerTitle className="sr-only">Create Webhook</DrawerTitle>
        <DrawerDescription className="sr-only">
          Create a new webhook to receive notifications
        </DrawerDescription>
        <Outlet />
      </DrawerContent>
    </Drawer>
  );
};
