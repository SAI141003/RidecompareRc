
import { 
  Users, Settings, MessageSquare, Gift, Car, User2, 
  Users2, Briefcase, Trophy, Tag
} from "lucide-react";
import { MenuItem } from "./MenuItem";

export const ProfileMenu = () => {
  const menuItems = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Family and teens",
      subtitle: "Teen and adult accounts",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Settings",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Messages",
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Send a gift",
    },
    {
      icon: <Car className="w-6 h-6" />,
      title: "RideCompare One",
      subtitle: "Premium membership",
    },
    {
      icon: <User2 className="w-6 h-6" />,
      title: "Earn by driving or delivering",
    },
    {
      icon: <Users2 className="w-6 h-6" />,
      title: "Saved groups",
      badge: "NEW",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Setup your business profile",
      subtitle: "Automate work travel & meal expenses",
    },
    {
      icon: <Users2 className="w-6 h-6" />,
      title: "Manage Business Account",
      subtitle: "Manage travel, meals, and operational tasks",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Partner Rewards",
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
