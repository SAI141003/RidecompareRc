
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
        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Card Number"
          value={paymentDetails.cardNumber}
          onChange={(e) => onChange("cardNumber", e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="MM/YY"
          value={paymentDetails.cardExpiry}
          onChange={(e) => onChange("cardExpiry", e.target.value)}
        />
        <Input
          type="password"
          placeholder="CVV"
          value={paymentDetails.cardCVV || ""}
          onChange={(e) => onChange("cardCVV", e.target.value)}
          maxLength={4}
        />
      </div>
    </div>
  );
};
