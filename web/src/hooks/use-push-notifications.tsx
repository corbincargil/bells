import { useReducer } from "react";
import { toast } from "sonner";

interface PushNotificationState {
  subscription: PushSubscription | null;
  permission: NotificationPermission;
  loading: boolean;
  error: string | null;
}

type PushNotificationAction =
  | { type: "START_LOADING" }
  | { type: "SET_SUBSCRIPTION"; payload: PushSubscription | null }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_PERMISSION"; payload: NotificationPermission };

const initialState: PushNotificationState = {
  subscription: null,
  permission: Notification.permission,
  loading: false,
  error: null,
};

const pushNotificationReducer = (
  state: PushNotificationState,
  action: PushNotificationAction
): PushNotificationState => {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, loading: true, error: null };

    case "SET_SUBSCRIPTION":
      return { ...state, subscription: action.payload, loading: false };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_PERMISSION":
      return { ...state, permission: action.payload, loading: false };

    default:
      return state;
  }
};

const usePushNotifications = () => {
  const [state, dispatch] = useReducer(pushNotificationReducer, initialState);

  const subscribe = async () => {
    dispatch({ type: "START_LOADING" });
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      });
      console.log("SUBSCRIPTION: ", sub);
      console.log("SUBSCRIPTION json: ", sub.toJSON());
      dispatch({ type: "SET_SUBSCRIPTION", payload: sub });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const unsubscribe = async () => {
    dispatch({ type: "START_LOADING" });
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      await sub?.unsubscribe();
      dispatch({ type: "SET_SUBSCRIPTION", payload: null });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const checkPermission = () => {
    if (Notification.permission === "granted") {
      return "granted";
    }
    if (Notification.permission === "denied") {
      return "denied";
    }
    return "default";
  };

  const hasRequestedPermission = () => {
    return localStorage.getItem("push-notification-asked") === "true";
  };

  const clearRequestedPermission = () => {
    localStorage.removeItem("push-notification-asked");
  };

  const requestPermission = () => {
    if (checkPermission() !== "granted" && !hasRequestedPermission()) {
      toast.info("Enable notifications?", {
        action: {
          label: "Enable",
          onClick: async () => {
            const permission = await Notification.requestPermission();
            dispatch({ type: "SET_PERMISSION", payload: permission });
            localStorage.setItem("push-notification-asked", "true");
            if (permission === "granted") {
              subscribe();
              toast.success("Notifications enabled");
            } else {
              toast.error(
                "Please enable notifications in your browser settings",
                {
                  description: "Settings > Site Settings > Notifications",
                }
              );
            }
          },
        },
        duration: 10000,
        closeButton: true,
      });
    }
  };

  return {
    ...state,
    subscribe,
    unsubscribe,
    checkPermission,
    requestPermission,
    hasRequestedPermission,
    clearRequestedPermission,
  };
};

export default usePushNotifications;
