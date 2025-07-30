import type { Webhook } from "@/types/webhook";

const WebhookCard = ({ webhook }: { webhook: Webhook }) => {
  return (
    <div className="group relative bg-background border border-border rounded-lg p-6 hover:shadow-md hover:border-border/50 transition-all duration-200 ease-in-out">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
            {webhook.name}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {webhook.description}
          </p>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {webhook.slug}
            </span>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default WebhookCard;
