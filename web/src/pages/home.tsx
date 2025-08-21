import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Bell, Webhook, Zap, Plus } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground font-brand">
          Welcome to Honk! 📢
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground font-heading">
          Turn any HTTP request into an instant notification
        </p>
      </div>

      {/* How It Works */}
      <div className="space-y-4 sm:space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground font-heading">
          How It Works
        </h2>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center space-y-4 p-6 bg-card border border-border rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-playful">
              1. Create a Webhook
            </h3>
            <p className="text-sm text-muted-foreground">
              Set up a custom webhook with your notification message and title
            </p>
          </div>

          <div className="text-center space-y-4 p-6 bg-card border border-border rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-playful">
              2. Connect Your Service
            </h3>
            <p className="text-sm text-muted-foreground">
              Use the webhook URL in your apps, CI/CD, monitoring tools, or any
              HTTP service
            </p>
          </div>

          <div className="text-center space-y-4 p-6 bg-card border border-border rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground font-playful">
              3. Get Notified
            </h3>
            <p className="text-sm text-muted-foreground">
              Receive instant push notifications on all your devices when the
              webhook is triggered
            </p>
          </div>
        </div>
      </div>

      <div className="bg-accent/50 border border-border rounded-lg p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-foreground font-heading">
          🚀 Quick Start Guide
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium text-foreground">
                Enable Push Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Click the bell icon in the header and allow notifications for
                this site
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium text-foreground">
                Create Your First Webhook
              </p>
              <p className="text-sm text-muted-foreground">
                Go to Webhooks and click "Create Webhook" to set up your first
                endpoint
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium text-foreground">Test It Out</p>
              <p className="text-sm text-muted-foreground">
                Use the test button or make a POST request to your webhook URL
                to see it in action
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => navigate("/webhooks")}
            className="font-playful"
          >
            <Webhook className="w-4 h-4" />
            Create First Webhook
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/notifications")}
            className="font-playful"
          >
            <Bell className="w-4 h-4" />
            View Notifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
