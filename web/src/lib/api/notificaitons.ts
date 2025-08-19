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

export const useNotification = (id: string) => {
  const { apiRequest } = useApiClient();

  return useQuery<NotificationWithWebhook>({
    queryKey: ["notification", id],
    queryFn: () => apiRequest(`/notifications/${id}`),
  });
};

export const usePatchReadStatus = () => {
  const { apiRequest } = useApiClient();

  return useMutation({
    mutationFn: ({
      notificationId,
      isRead,
    }: {
      notificationId: string;
      isRead: boolean;
    }) =>
      apiRequest(`/notifications/${notificationId}/?read=${isRead}`, {
        method: "PATCH",
      }),
  });
};

export const useDeleteNotification = () => {
  const { apiRequest } = useApiClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      apiRequest(`/notifications/${notificationId}`, { method: "DELETE" }),
  });
};
