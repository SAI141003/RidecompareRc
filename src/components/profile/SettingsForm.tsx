
import { Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export const SettingsForm = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Error logging out");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">Appearance</Label>
          <p className="text-sm text-muted-foreground">
            Choose between light and dark mode
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <Moon className="h-4 w-4" />
        </div>
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </Card>
  );
};
