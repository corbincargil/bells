import { useNavigate, useParams, useSearchParams } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useNotification } from "@/lib/api/notificaitons";
import { NotificationDetailsFallback } from "../../_components/notification-details/fallback";
import { NotificationDetailsLoading } from "../../_components/notification-details/loading";
import { NotificationDetails } from "../../_components/notification-details";
import { AppRoutes } from "@/router";
import { buildUrlWithCurrentParams } from "@/lib/navigation";

export default function NotificationDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();

  if (!id) return <NotificationDetailsFallback />;

  const { data: notification, isLoading, isError } = useNotification(id);

  if (isLoading) return <NotificationDetailsLoading />;

  if (isError || !notification) return <NotificationDetailsFallback />;

  const handleClose = () => {
    const url = buildUrlWithCurrentParams(
      AppRoutes.NOTIFICATIONS,
      searchParams
    );
    navigate(url);
  };

  return (
    <ErrorBoundary fallback={<NotificationDetailsFallback />}>
      <NotificationDetails notification={notification} onClose={handleClose} />
    </ErrorBoundary>
  );
}
