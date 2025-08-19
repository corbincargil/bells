import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "./client";
import type { NotificationWithWebhook } from "@/types/notification";

export const useNotifications = () => {
  const { apiRequest } = useApiClient();

  return useQuery<NotificationWithWebhook[]>({
    queryKey: ["notifications"],
    queryFn: () => apiRequest("/notifications"),
  });
};

export const useDeleteNotification = () => {
  const { apiRequest } = useApiClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      apiRequest(`/notifications/${notificationId}`, { method: "DELETE" }),
  });
};
