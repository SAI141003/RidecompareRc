
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { 
  Users, Settings, MessageSquare, Gift, Car, User2, 
  Users2, Briefcase, Trophy, Tag, Home 
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {user.email?.split('@')[0]?.toUpperCase() || 'USER'}
            </h1>
            <div className="flex items-center">
              <span className="text-sm mr-2">★</span>
              <span className="text-sm">4.90</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <User2 className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="space-y-6">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-900 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-gray-400">
                  {item.icon}
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.subtitle && (
                    <div className="text-sm text-gray-400">{item.subtitle}</div>
                  )}
                </div>
              </div>
              {item.badge && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
