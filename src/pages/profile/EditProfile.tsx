
import { PersonalDetailsForm } from "@/components/profile/PersonalDetailsForm";
import { AddressesForm } from "@/components/profile/AddressesForm";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import type { Address } from "@/types/profile";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
  });

  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (profile) {
        setPersonalDetails({
          username: profile.username || "",
          firstName: profile.first_name || "",
          middleName: profile.middle_name || "",
          lastName: profile.last_name || "",
          mobileNumber: profile.mobile_number || "",
        });
      }

      // Load addresses
      const { data: addressesData, error: addressesError } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user?.id);

      if (addressesError) throw addressesError;

      if (addressesData) {
        setAddresses(addressesData.map(addr => ({
          id: addr.id,
          addressType: addr.address_type as 'home' | 'work' | 'preferred',
          streetAddress: addr.street_address,
          city: addr.city,
          state: addr.state,
          postalCode: addr.postal_code,
          country: addr.country,
          isDefault: addr.is_default || false,
        })));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  const handlePersonalDetailsChange = (field: string, value: string) => {
    setPersonalDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = (address: Address) => {
    setAddresses((prev) => [...prev, address]);
  };

  const handleUpdateAddress = (index: number, address: Address) => {
    setAddresses((prev) => {
      const newAddresses = [...prev];
      newAddresses[index] = address;
      return newAddresses;
    });
  };

  const handleDeleteAddress = (index: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save changes");
      return;
    }

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: personalDetails.username,
          first_name: personalDetails.firstName,
          middle_name: personalDetails.middleName,
          last_name: personalDetails.lastName,
          mobile_number: personalDetails.mobileNumber,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Handle addresses
      // First, delete all existing addresses
      const { error: deleteError } = await supabase
        .from('user_addresses')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Then insert new addresses
      if (addresses.length > 0) {
        const { error: insertError } = await supabase
          .from('user_addresses')
          .insert(
            addresses.map(addr => ({
              user_id: user.id,
              address_type: addr.addressType,
              street_address: addr.streetAddress,
              city: addr.city,
              state: addr.state,
              postal_code: addr.postalCode,
              country: addr.country,
              is_default: addr.isDefault,
            }))
          );

        if (insertError) throw insertError;
      }

      toast.success("Profile updated successfully");
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="hover:bg-gray-800"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
        
        <div className="space-y-8">
          <div className="bg-gray-900 p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            <PersonalDetailsForm {...personalDetails} onChange={handlePersonalDetailsChange} />
          </div>

          <div className="bg-gray-900 p-6 rounded-lg space-y-6">
            <h2 className="text-xl font-semibold mb-4">Addresses</h2>
            <AddressesForm
              addresses={addresses}
              onAddAddress={handleAddAddress}
              onUpdateAddress={handleUpdateAddress}
              onDeleteAddress={handleDeleteAddress}
            />
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
