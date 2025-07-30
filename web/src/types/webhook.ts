export interface Webhook {
  uuid: string;
  name: string;
  description: string;
  slug: string;
  notificationTitle: string;
  notificationMessage: string;
  isActive: boolean;
  lastUsed: string;
  createdAt: string;
  updatedAt: string;
}
