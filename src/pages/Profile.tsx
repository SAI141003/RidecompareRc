
import { useState, useEffect } from "react";
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

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user) return;
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("username, full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

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
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

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
    const filePath = `${user!.id}/${crypto.randomUUID()}.${fileExt}`;

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
    if (!user) return;
    
    setLoading(true);

    try {
      // Check if username is available (if changed)
      if (username) {
        const { data: existingUsers } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .neq("id", user.id);

        if (existingUsers && existingUsers.length > 0) {
          toast.error("Username is already taken");
          setLoading(false);
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <Card className="w-full max-w-md relative bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur" />
                <Avatar className="h-24 w-24 cursor-pointer relative">
                  <AvatarImage src={avatarPreview || currentAvatarUrl} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
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
              </div>
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
                className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl"
              type="submit" 
              disabled={loading}
            >
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
