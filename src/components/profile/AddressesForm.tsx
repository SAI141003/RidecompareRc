
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Building2, MapPin, PlusCircle, Trash2 } from "lucide-react";
import type { Address } from "@/types/profile";

interface AddressesFormProps {
  addresses: Address[];
  onAddAddress: (address: Address) => void;
  onUpdateAddress: (index: number, address: Address) => void;
  onDeleteAddress: (index: number) => void;
}

export const AddressesForm = ({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
}: AddressesFormProps) => {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    addressType: 'home',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false,
  });

  const handleSubmitNewAddress = () => {
    onAddAddress(newAddress);
    setShowNewAddressForm(false);
    setNewAddress({
      addressType: 'home',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false,
    });
  };

  const getAddressIcon = (type: Address['addressType']) => {
    switch (type) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <Building2 className="h-4 w-4" />;
      case 'preferred':
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {addresses.map((address, index) => (
        <Card key={address.id || index} className="bg-white/50 backdrop-blur-sm border-white/20">
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                {getAddressIcon(address.addressType)}
                <span className="capitalize">{address.addressType} Address</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteAddress(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                value={address.streetAddress}
                onChange={(e) => onUpdateAddress(index, { ...address, streetAddress: e.target.value })}
                placeholder="Street Address"
                className="bg-white/50"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={address.city}
                  onChange={(e) => onUpdateAddress(index, { ...address, city: e.target.value })}
                  placeholder="City"
                  className="bg-white/50"
                />
                <Input
                  value={address.state}
                  onChange={(e) => onUpdateAddress(index, { ...address, state: e.target.value })}
                  placeholder="State"
                  className="bg-white/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={address.postalCode}
                  onChange={(e) => onUpdateAddress(index, { ...address, postalCode: e.target.value })}
                  placeholder="Postal Code"
                  className="bg-white/50"
                />
                <Input
                  value={address.country}
                  onChange={(e) => onUpdateAddress(index, { ...address, country: e.target.value })}
                  placeholder="Country"
                  className="bg-white/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {showNewAddressForm ? (
        <Card className="bg-white/50 backdrop-blur-sm border-white/20">
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <Label>Address Type</Label>
                <Select
                  value={newAddress.addressType}
                  onValueChange={(value: 'home' | 'work' | 'preferred') => 
                    setNewAddress({ ...newAddress, addressType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="preferred">Preferred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                value={newAddress.streetAddress}
                onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                placeholder="Street Address"
                className="bg-white/50"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  placeholder="City"
                  className="bg-white/50"
                />
                <Input
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  placeholder="State"
                  className="bg-white/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                  placeholder="Postal Code"
                  className="bg-white/50"
                />
                <Input
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                  placeholder="Country"
                  className="bg-white/50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNewAddressForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitNewAddress}>Save Address</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowNewAddressForm(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      )}
    </div>
  );
};
