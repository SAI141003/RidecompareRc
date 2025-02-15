
import { PersonalDetailsForm } from "@/components/profile/PersonalDetailsForm";
import { AddressesForm } from "@/components/profile/AddressesForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Address } from "@/types/profile";

const EditProfile = () => {
  const [personalDetails, setPersonalDetails] = useState({
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
  });

  const [addresses, setAddresses] = useState<Address[]>([]);

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

  const handleSave = () => {
    // TODO: Implement save functionality with Supabase
    toast.success("Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        
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

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
