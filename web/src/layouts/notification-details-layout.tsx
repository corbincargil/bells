import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { useEffect, useState } from "react";
import { AppRoutes } from "@/router";
import { buildUrlWithCurrentParams } from "@/lib/navigation";

export const NotificationDetailsLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const detailsMode = location.pathname.includes("/details");

  const isDrawerActive = detailsMode;

  const onOpenChange = (open: boolean) => {
    if (!open) {
      const url = buildUrlWithCurrentParams(
        AppRoutes.NOTIFICATIONS,
        searchParams
      );
      navigate(url);
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
      handleOnly={!isMobile}
    >
      <DrawerContent className="md:!w-[600px] md:!max-w-[600px]">
        <DrawerTitle className="sr-only">Notification Details</DrawerTitle>
        <DrawerDescription className="sr-only">
          View notification details
        </DrawerDescription>
        <Outlet />
      </DrawerContent>
    </Drawer>
  );
};
