import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./client";
import type { Webhook } from "@/types/webhook";

export const useWebhooks = () => {
  const { apiRequest } = useApiClient();

  return useQuery<Webhook[]>({
    queryKey: ["webhooks"],
    queryFn: () => apiRequest("/webhooks"),
  });
};
