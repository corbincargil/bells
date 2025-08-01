import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./client";
import type { Subscription } from "@/types/subscription";

export const useSubscriptions = () => {
  const { apiRequest } = useApiClient();

  return useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: () => apiRequest("/subscriptions"),
  });
};
