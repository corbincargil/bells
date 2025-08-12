import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "./client";
import type { CreateWebhook, UpdateWebhook, Webhook } from "@/types/webhook";

export const useWebhooks = () => {
  const { apiRequest } = useApiClient();

  return useQuery<Webhook[]>({
    queryKey: ["webhooks"],
    queryFn: () => apiRequest("/webhooks"),
  });
};

export const useWebhook = (id: string) => {
  const { apiRequest } = useApiClient();

  return useQuery<Webhook>({
    queryKey: ["webhook", id],
    queryFn: () => apiRequest(`/webhooks/${id}`),
  });
};

export const useCreateWebhook = () => {
  const { apiRequest } = useApiClient();

  return useMutation({
    mutationFn: (data: CreateWebhook) => {
      return apiRequest("/webhooks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });
};

export const useUpdateWebhook = () => {
  const { apiRequest } = useApiClient();

  return useMutation({
    mutationFn: (data: UpdateWebhook) => {
      return apiRequest("/webhooks", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  });
};

export const useDeleteWebhook = () => {
  const { apiRequest } = useApiClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/webhooks/${id}`, { method: "DELETE" }),
  });
};
