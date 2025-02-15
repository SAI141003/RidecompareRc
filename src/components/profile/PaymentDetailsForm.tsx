
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import type { PaymentDetails } from "@/types/profile";

interface PaymentDetailsFormProps {
  paymentDetails: PaymentDetails;
  onChange: (field: keyof PaymentDetails, value: string) => void;
}

export const PaymentDetailsForm = ({
  paymentDetails,
  onChange,
}: PaymentDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Card Number"
          value={paymentDetails.cardNumber}
          onChange={(e) => onChange("cardNumber", e.target.value)}
          className="pl-10 bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="MM/YY"
          value={paymentDetails.cardExpiry}
          onChange={(e) => onChange("cardExpiry", e.target.value)}
          className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
        />
        <Input
          type="password"
          placeholder="CVV"
          value={paymentDetails.cardCVV || ""}
          onChange={(e) => onChange("cardCVV", e.target.value)}
          maxLength={4}
          className="bg-white/50 backdrop-blur-sm border-white/20 focus:border-purple-500 transition-colors"
        />
      </div>
    </div>
  );
};
