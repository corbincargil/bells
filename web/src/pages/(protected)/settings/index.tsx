import SubscriptionList from "./_components/subscription-list";

const Settings = () => {
  return (
    <div className="space-y-4 overflow-y-scroll h-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground font-heading">
          Settings
        </h2>
        <p className="text-muted-foreground">
          Your devices that receive notifications
        </p>
      </div>
      <SubscriptionList />
    </div>
  );
};

export default Settings;
