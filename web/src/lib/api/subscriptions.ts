import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiClient } from "./client";
import type {
  Subscription,
  SubscriptionRequestBody,
} from "@/types/subscription";

export const useSubscriptions = () => {
  const { apiRequest } = useApiClient();

  return useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: () => apiRequest("/subscriptions"),
  });
};

export const useCreateSubscription = () => {
  const { apiRequest } = useApiClient();

  return useMutation<Subscription, Error, SubscriptionRequestBody>({
    mutationFn: (requestBody: SubscriptionRequestBody) =>
      apiRequest("/subscriptions/subscribe", {
        method: "POST",
        body: JSON.stringify(requestBody),
      }),
  });
};
