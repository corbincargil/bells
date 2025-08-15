export interface DeviceInfo {
  browser: string;
  platform: string;
  name: string;
}

export interface SubscriptionRequestBody {
  subscription: PushSubscriptionJSON;
  device: DeviceInfo;
}

export interface Subscription {
  uuid: string;
  isActive: boolean;
  endpoint: string;
  p256dhKey: string;
  authKey: string;
  expiration: Date | null;
  deviceName: string;
  browser: string;
  platform: string;
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
}
