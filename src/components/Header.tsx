
import { LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error: any) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2"
      >
        <UserCircle className="h-4 w-4" />
        Profile
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};
