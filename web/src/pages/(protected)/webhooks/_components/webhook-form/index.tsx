import { Switch } from "@/components/ui/switch";
import type { CreateWebhook, Webhook } from "@/types/webhook";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWebhookSchema } from "@/types/webhook";
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
import { useCreateWebhook } from "@/lib/api/webhooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const createWebhook = useCreateWebhook();
  const form = useForm<CreateWebhook>({
    resolver: zodResolver(createWebhookSchema),
    defaultValues,
  });

  const queryClient = useQueryClient();
  const { mutate: createWebhookMutation, isPending } = useMutation({
    mutationFn: createWebhook,
  });

  const onSubmit = async (data: CreateWebhook) => {
    createWebhookMutation(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["webhooks"] });
        toast.success("Webhook created successfully", {});
        onCancel();
        form.reset();
      },
      onError: (e) => {
        console.error(e);
        toast.error(`Failed to create webhook: ${e.message}`, {});
      },
    });
  };

  return (
    <div className="h-full max-h-[90vh] flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Create Webhook
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
                      {...field}
                      className="max-h-[400px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {webhook ? "Update Webhook" : "Create Webhook"}
              </Button>
              <Button
                type="button"
                className="text-muted-foreground"
                variant="outline"
                onClick={onCancel}
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
