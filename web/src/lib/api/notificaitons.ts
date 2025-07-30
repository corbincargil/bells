import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./client";
import type { Notification } from "@/types/notification";

export const useNotifications = () => {
  const { apiRequest } = useApiClient();

  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => apiRequest("/notifications"),
  });
};
