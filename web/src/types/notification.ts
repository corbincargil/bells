export interface Notification {
  uuid: string;
  title: string;
  message: string;
  url: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationWithWebhook extends Notification {
  webhookUuid?: string;
  webhookName?: string;
  webhookSlug?: string;
}
