
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}

export const MenuItem = ({ icon, title, subtitle, badge }: MenuItemProps) => {
  return (
    <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-900 -mx-2 px-2 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div className="text-gray-400">
          {icon}
        </div>
        <div>
          <div className="font-medium">{title}</div>
          {subtitle && (
            <div className="text-sm text-gray-400">{subtitle}</div>
          )}
        </div>
      </div>
      {badge && (
        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
          {badge}
        </span>
      )}
    </div>
  );
};
