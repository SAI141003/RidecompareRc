
import { PaymentDetailsForm } from "@/components/profile/PaymentDetailsForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import type { PaymentDetails as PaymentDetailsType } from "@/types/profile";

const PaymentDetails = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsType>({
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });

  const handleChange = (field: keyof PaymentDetailsType, value: string) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality with Supabase
    toast.success("Payment details updated successfully");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6 max-w-md">
        <h1 className="text-2xl font-bold mb-6">Payment Details</h1>
        
        <div className="bg-gray-900 p-6 rounded-lg space-y-6">
          <PaymentDetailsForm
            paymentDetails={paymentDetails}
            onChange={handleChange}
          />
          <Button onClick={handleSave} className="w-full">
            Save Payment Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
