import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./client";
import type { Webhook, CreateWebhook } from "@/types/webhook";

export const useWebhooks = () => {
  const { apiRequest } = useApiClient();

  return useQuery<Webhook[]>({
    queryKey: ["webhooks"],
    queryFn: () => apiRequest("/webhooks"),
  });
};

export const useCreateWebhook = () => {
  const { apiRequest } = useApiClient();

  return async (data: CreateWebhook) => {
    return apiRequest("/webhooks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };
};
