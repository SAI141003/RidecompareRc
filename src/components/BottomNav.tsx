
import { Home, Grid, Receipt, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16">
      <div className="grid grid-cols-4 h-full max-w-md mx-auto">
        <Link to="/" className={`nav-item ${isActive('/') ? 'text-primary' : 'text-muted-foreground'} flex flex-col items-center justify-center`}>
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/services" className={`nav-item ${isActive('/services') ? 'text-primary' : 'text-muted-foreground'} flex flex-col items-center justify-center`}>
          <Grid className="w-6 h-6" />
          <span className="text-xs mt-1">Services</span>
        </Link>
        <Link to="/activity" className={`nav-item ${isActive('/activity') ? 'text-primary' : 'text-muted-foreground'} flex flex-col items-center justify-center`}>
          <Receipt className="w-6 h-6" />
          <span className="text-xs mt-1">Activity</span>
        </Link>
        <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'} flex flex-col items-center justify-center`}>
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </div>
  );
};
