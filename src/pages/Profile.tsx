
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { PersonalDetailsForm } from "@/components/profile/PersonalDetailsForm";
import { PaymentDetailsForm } from "@/components/profile/PaymentDetailsForm";
import type { PaymentDetails, ProfileFormData } from "@/types/profile";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    paymentDetails: {
      cardNumber: "",
      cardExpiry: "",
      cardCVV: "",
    },
    avatarUrl: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("username, first_name, middle_name, last_name, mobile_number, payment_details, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      toast.error("Error loading profile");
      return;
    }

    if (profile) {
      setFormData({
        username: profile.username || "",
        firstName: profile.first_name || "",
        middleName: profile.middle_name || "",
        lastName: profile.last_name || "",
        mobileNumber: profile.mobile_number || "",
        paymentDetails: (profile.payment_details as PaymentDetails) || {
          cardNumber: "",
          cardExpiry: "",
          cardCVV: "",
        },
        avatarUrl: profile.avatar_url || "",
      });
    }
  };

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
    if (!avatar) return formData.avatarUrl;

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
      if (formData.username) {
        const { data: existingUsers } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", formData.username)
          .neq("id", user.id);

        if (existingUsers && existingUsers.length > 0) {
          toast.error("Username is already taken");
          setLoading(false);
          return;
        }
      }

      let avatarUrl = formData.avatarUrl;
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
          username: formData.username,
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          mobile_number: formData.mobileNumber,
          payment_details: {
            cardNumber: formData.paymentDetails.cardNumber,
            cardExpiry: formData.paymentDetails.cardExpiry,
          },
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

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentDetailsChange = (field: keyof PaymentDetails, value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        [field]: value,
      },
    }));
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
            <ProfileAvatar
              avatarUrl={formData.avatarUrl}
              previewUrl={avatarPreview}
              firstName={formData.firstName}
              onAvatarChange={handleAvatarChange}
            />

            <PersonalDetailsForm
              username={formData.username}
              firstName={formData.firstName}
              middleName={formData.middleName}
              lastName={formData.lastName}
              mobileNumber={formData.mobileNumber}
              onChange={handleFormChange}
            />

            <PaymentDetailsForm
              paymentDetails={formData.paymentDetails}
              onChange={handlePaymentDetailsChange}
            />

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
