import SubscriptionList from "./_components/subscription-list";

const Settings = () => {
  return (
    <div className="space-y-4 overflow-y-scroll h-full">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your devices</p>
      </div>
      <SubscriptionList />
    </div>
  );
};

export default Settings;
