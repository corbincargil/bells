import NotificationList from "@/pages/(protected)/notifications/_components/notification-list";

const Notifications = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <NotificationList />
    </div>
  );
};

export default Notifications;
