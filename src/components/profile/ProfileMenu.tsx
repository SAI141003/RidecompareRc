
import { 
  Settings, MessageSquare, Car, Tag, CreditCard, User, LogOut
} from "lucide-react";
import { MenuItem } from "./MenuItem";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ProfileMenu = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Error logging out");
    }
  };

  const menuItems = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Edit Profile",
      onClick: () => navigate("/profile/edit"),
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payment Details",
      onClick: () => navigate("/profile/payment"),
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Settings",
      onClick: () => navigate("/profile/settings"),
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Messages",
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "RideCompare",
      subtitle: "Premium membership",
    },
    {
      icon: <Tag className="w-6 h-6" />,
      title: "RideCompare promotions",
    },
    {
      icon: <LogOut className="w-6 h-6" />,
      title: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="space-y-6">
      {menuItems.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </div>
  );
};
