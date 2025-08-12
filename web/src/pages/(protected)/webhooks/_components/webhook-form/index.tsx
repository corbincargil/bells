import { Switch } from "@/components/ui/switch";
import type { CreateWebhook, UpdateWebhook, Webhook } from "@/types/webhook";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWebhookSchema, updateWebhookSchema } from "@/types/webhook";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateWebhook,
  useDeleteWebhook,
  useUpdateWebhook,
} from "@/lib/api/webhooks";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteWebhookButton } from "../delete-webhook-button";

interface WebhookFormProps {
  webhook?: Webhook;
  onCancel: () => void;
}

const defaultValues: CreateWebhook = {
  name: "",
  slug: "",
  notificationTitle: "",
  notificationMessage: "",
  isActive: true,
  description: "",
};

export const WebhookForm = ({ webhook, onCancel }: WebhookFormProps) => {
  const formSchema = webhook ? updateWebhookSchema : createWebhookSchema;
  const initialValues = webhook
    ? { ...webhook, description: webhook.description ?? "" }
    : defaultValues;

  const form = useForm<CreateWebhook | UpdateWebhook>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const queryClient = useQueryClient();

  const { mutate: createWebhookMutation, isPending: isCreating } =
    useCreateWebhook();

  const { mutate: updateWebhookMutation, isPending: isUpdating } =
    useUpdateWebhook();

  const { mutate: deleteWebhookMutation, isPending: isDeleting } =
    useDeleteWebhook();

  const onSubmit = async (data: CreateWebhook | UpdateWebhook) => {
    if (webhook) {
      updateWebhookMutation(data as UpdateWebhook, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["webhooks"],
          });
          queryClient.invalidateQueries({
            queryKey: ["webhook", webhook.uuid],
          });
          toast.success("Webhook updated successfully", {});
        },
        onError: (e) => {
          console.error(e);
          toast.error(`Failed to update webhook: ${e.message}`);
        },
      });
    } else {
      createWebhookMutation(data as CreateWebhook, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["webhooks"] });
          toast.success("Webhook created successfully");
          onCancel();
          form.reset();
        },
        onError: (e) => {
          console.error(e);
          toast.error(`Failed to create webhook: ${e.message}`);
        },
      });
    }
  };

  const onDelete = async () => {
    if (!webhook) return;

    deleteWebhookMutation(webhook.uuid, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["webhooks"] });
        toast.success("Webhook deleted successfully");
        onCancel();
      },
      onError: (e) => {
        queryClient.invalidateQueries({ queryKey: ["webhooks"] });
        toast.error(`Failed to delete webhook: ${e.message}`);
      },
    });
  };

  const isPending = isCreating || isUpdating || isDeleting;

  return (
    <div className="h-full max-h-[90vh] flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {webhook ? "Update Webhook" : "Create Webhook"}
        </h2>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex items-start gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-foreground">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My webhook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Active?</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">URL Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-webhook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Notification Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notificationMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Notification Message
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Description
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="max-h-[400px]"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              {webhook && (
                <DeleteWebhookButton
                  onDelete={onDelete}
                  isPending={isPending}
                />
              )}
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {webhook ? "Update Webhook" : "Create Webhook"}
              </Button>
              <Button
                type="button"
                className="text-muted-foreground"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
