import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import usePushNotifications from "../hooks/use-push-notifications";

interface PushNotificationContextType {
  subscription: PushSubscription | null;
  permission: NotificationPermission;
  loading: boolean;
  error: string | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  checkPermission: () => string;
  requestPermission: () => void;
  hasRequestedPermission: () => boolean;
  clearRequestedPermission: () => void;
}

const PushNotificationContext = createContext<
  PushNotificationContextType | undefined
>(undefined);

interface PushNotificationProviderProps {
  children: ReactNode;
}

export const PushNotificationProvider = ({
  children,
}: PushNotificationProviderProps) => {
  const pushNotificationState = usePushNotifications();

  return (
    <PushNotificationContext.Provider value={pushNotificationState}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotificationContext = () => {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error(
      "usePushNotificationContext must be used within a PushNotificationProvider"
    );
  }
  return context;
};
