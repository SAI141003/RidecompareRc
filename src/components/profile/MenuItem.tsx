
interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

export const MenuItem = ({ icon, title, subtitle, onClick }: MenuItemProps) => {
  return (
    <div 
      className="flex items-center space-x-4 cursor-pointer hover:bg-gray-800 p-3 rounded-lg transition-colors"
      onClick={onClick}
    >
      {icon}
      <div>
        <h3 className="font-medium">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
