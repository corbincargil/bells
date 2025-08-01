import { useSubscriptions } from "@/lib/api/subscriptions";

const SubscriptionList = () => {
  const { data: subscriptions, isLoading, error } = useSubscriptions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!subscriptions || subscriptions.length === 0)
    return <div>No subscriptions found</div>;

  return (
    <div className="flex flex-col gap-2">
      {subscriptions.map((subscription) => (
        <div
          key={subscription.uuid}
          className="flex flex-col gap-2 border-b border-gray-200 p-4"
        >
          <p>{subscription.uuid}</p>
          <p>{subscription.isActive ? "Active" : "Inactive"}</p>
          <p>{new Date(subscription.createdAt).toLocaleDateString()}</p>
          <p>{new Date(subscription.updatedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionList;
