
import { 
  Settings, MessageSquare, Car, Tag
} from "lucide-react";
import { MenuItem } from "./MenuItem";

export const ProfileMenu = () => {
  const menuItems = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Settings",
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
  ];

  return (
    <div className="space-y-6">
      {menuItems.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </div>
  );
};
