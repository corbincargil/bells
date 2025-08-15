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

export const getCurrentSubscription = async () => {
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error("Error getting current subscription:", error);
    return null;
  }
};
