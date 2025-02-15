
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, Upload } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>("");

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  // Fetch profile data
  const fetchProfile = async () => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("username, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      toast.error("Error loading profile");
      return;
    }

    if (profile) {
      setUsername(profile.username || "");
      setFullName(profile.full_name || "");
      setCurrentAvatarUrl(profile.avatar_url || "");
    }
  };

  // Fetch profile on mount
  useState(() => {
    fetchProfile();
  }, [user.id]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const uploadAvatar = async () => {
    if (!avatar) return currentAvatarUrl;

    const fileExt = avatar.name.split('.').pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatar);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if username is available (if changed)
      if (username) {
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .neq("id", user.id)
          .single();

        if (existingUser) {
          toast.error("Username is already taken");
          return;
        }
      }

      let avatarUrl = currentAvatarUrl;
      if (avatar) {
        try {
          avatarUrl = await uploadAvatar();
        } catch (error: any) {
          toast.error("Failed to upload avatar");
          console.error("Avatar upload error:", error);
          return;
        }
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          username,
          full_name: fullName,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (updateError) {
        toast.error("Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 cursor-pointer relative group">
                <AvatarImage src={avatarPreview || currentAvatarUrl} />
                <AvatarFallback className="text-2xl">
                  {fullName ? fullName.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Upload avatar"
                />
              </Avatar>
              <p className="text-sm text-muted-foreground">
                Click to change avatar
              </p>
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
