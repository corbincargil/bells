import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 px-4">
      <div className="space-y-4">
        <h1 className="text-8xl sm:text-9xl font-bold text-primary/20 font-brand select-none">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playful">
            Oops! Page not found 🔍
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Looks like this page got lost in the notification void. Don't worry,
            it happens to the best of us!
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="font-playful"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Button onClick={() => navigate("/")} className="font-playful">
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
