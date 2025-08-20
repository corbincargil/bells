import { z } from "zod";

export interface Webhook {
  uuid: string;
  name: string;
  description?: string;
  slug: string;
  endpoint: string; // generated on server
  notificationTitle: string;
  notificationMessage: string;
  isActive: boolean;
  lastUsed: string;
  createdAt: string;
  updatedAt: string;
}

const nameRequired = "Name is required";
const nameError = "Name must be between 1 and 100 characters";
const slugRequired = "Slug is required";
const slugError =
  "Slug must contain only lowercase letters, numbers, and hyphens. Must be between 1 and 100 characters";
const slugRegex = /^[a-z0-9-]+$/;
const titleRequired = "Notification title is required";
const titleError = "Notification title must be between 1 and 100 characters";
const messageRequired = "Notification message is required";
const messageError =
  "Notification message must be between 1 and 1000 characters";

export const createWebhookSchema = z.object({
  name: z
    .string({ error: nameRequired })
    .min(1, { message: nameRequired })
    .max(100, { message: nameError }),
  description: z.string().optional(),
  slug: z
    .string({ error: slugRequired })
    .min(1, { message: slugRequired })
    .max(100, { message: slugError })
    .regex(slugRegex, { error: slugError }),
  notificationTitle: z
    .string({ error: titleRequired })
    .min(1, { message: titleRequired })
    .max(100, { message: titleError }),
  notificationMessage: z
    .string({ error: messageRequired })
    .min(1, { message: messageRequired })
    .max(1000, { message: messageError }),
  isActive: z.boolean(),
});

export const updateWebhookSchema = z.object({
  uuid: z.uuid(),
  name: z
    .string({ error: nameRequired })
    .min(1, { message: nameRequired })
    .max(100, { message: nameError }),
  description: z.string().optional(),
  slug: z
    .string({ error: slugRequired })
    .min(1, { message: slugRequired })
    .max(100, { message: slugError })
    .regex(slugRegex, { error: slugError }),
  notificationTitle: z
    .string({ error: titleRequired })
    .min(1, { message: titleRequired })
    .max(100, { message: titleError }),
  notificationMessage: z
    .string({ error: messageRequired })
    .min(1, { message: messageRequired })
    .max(1000, { message: messageError }),
  isActive: z.boolean(),
});

export type CreateWebhook = z.infer<typeof createWebhookSchema>;
export type UpdateWebhook = z.infer<typeof updateWebhookSchema>;
