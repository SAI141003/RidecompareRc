
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RasaConfig = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Test the API key with a simple request to RASA
      const { data, error } = await supabase.functions.invoke('test-rasa-key', {
        body: { key: apiKey }
      });

      if (error) throw error;

      if (data.success) {
        toast.success("RASA API key saved successfully");
        navigate('/profile/settings');
      } else {
        toast.error("Invalid RASA API key");
      }
    } catch (error) {
      console.error("Error saving RASA key:", error);
      toast.error("Failed to save RASA API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile/settings')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">RASA API Configuration</h1>
        </div>

        <form onSubmit={handleSaveKey} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              RASA API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your RASA API key"
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !apiKey}
          >
            {isLoading ? "Saving..." : "Save API Key"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RasaConfig;
