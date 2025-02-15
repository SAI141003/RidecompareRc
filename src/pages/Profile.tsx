
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { BottomNav } from "@/components/BottomNav";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileMenu } from "@/components/profile/ProfileMenu";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6 pb-24">
        <ProfileHeader 
          username={user.email?.split('@')[0]?.toUpperCase() || 'USER'} 
        />
        <ProfileMenu />
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
