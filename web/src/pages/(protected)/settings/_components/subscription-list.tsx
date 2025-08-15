import { useEffect, useState } from "react";
import { SubscriptionCard } from "./subscription-card";
import {
  getCurrentSubscription,
  useSubscriptions,
} from "@/lib/api/subscriptions";

const SubscriptionList = () => {
  const [currentSubscription, setCurrentSubscription] =
    useState<PushSubscription | null>(null);

  const { data: subscriptions, isLoading, error } = useSubscriptions();

  useEffect(() => {
    getCurrentSubscription().then(setCurrentSubscription);
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
        <p className="font-medium">Error loading subscriptions</p>
      </div>
    );

  if (!subscriptions || subscriptions.length === 0)
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-foreground mb-2">
          No subscriptions found
        </h3>
        <p className="text-muted-foreground">
          You don't have any subscriptions yet.
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.uuid}
          subscription={subscription}
          isCurrentDevice={
            subscription.endpoint === currentSubscription?.endpoint
          }
        />
      ))}
    </div>
  );
};

export default SubscriptionList;
