
import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface ProfileHeaderProps {
  username: string;
}

export const ProfileHeader = ({ username }: ProfileHeaderProps) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(username);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, username')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (profile) {
        if (profile.first_name && profile.last_name) {
          setDisplayName(`${profile.first_name} ${profile.last_name}`);
        } else if (profile.username) {
          setDisplayName(profile.username);
        } else {
          setDisplayName(username);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setDisplayName(username);
    }
  };

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
      </div>
      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
        <User2 className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );
};
