
import { User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { ProfileAvatar } from "./ProfileAvatar";
import { toast } from "sonner";

interface ProfileHeaderProps {
  username: string;
}

export const ProfileHeader = ({ username }: ProfileHeaderProps) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(username);
  const [firstName, setFirstName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, username, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (profile) {
        if (profile.first_name && profile.last_name) {
          setDisplayName(`${profile.first_name} ${profile.last_name}`);
          setFirstName(profile.first_name);
        } else if (profile.username) {
          setDisplayName(profile.username);
        } else {
          setDisplayName(username);
        }
        
        if (profile.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setDisplayName(username);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture');
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <ProfileAvatar
        avatarUrl={avatarUrl}
        previewUrl={avatarPreview}
        firstName={firstName}
        onAvatarChange={handleAvatarChange}
      />
      <h1 className="text-3xl font-bold mt-4">{displayName}</h1>
    </div>
  );
};
