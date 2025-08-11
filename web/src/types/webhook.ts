import { z } from "zod";

export interface Webhook {
  uuid: string;
  name: string;
  description?: string;
  slug: string;
  notificationTitle: string;
  notificationMessage: string;
  isActive: boolean;
  lastUsed: string;
  createdAt: string;
  updatedAt: string;
}

export const createWebhookSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().min(1),
  notificationTitle: z.string().min(1),
  notificationMessage: z.string().min(1),
  isActive: z.boolean(),
});

export type CreateWebhook = z.infer<typeof createWebhookSchema>;
