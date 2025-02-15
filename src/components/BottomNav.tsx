
import { Home, Grid, Receipt, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border h-16">
      <div className="grid grid-cols-4 h-full max-w-md mx-auto">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
          <Home className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link to="/services" className={`nav-item ${isActive('/services') ? 'active' : ''}`}>
          <Grid className="w-6 h-6" />
          <span>Services</span>
        </Link>
        <Link to="/activity" className={`nav-item ${isActive('/activity') ? 'active' : ''}`}>
          <Receipt className="w-6 h-6" />
          <span>Activity</span>
        </Link>
        <Link to="/account" className={`nav-item ${isActive('/account') ? 'active' : ''}`}>
          <User className="w-6 h-6" />
          <span>Account</span>
        </Link>
      </div>
    </div>
  );
};
