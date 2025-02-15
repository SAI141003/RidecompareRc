
export interface PaymentDetails {
  cardNumber: string;
  cardExpiry: string;
  cardCVV?: string;
}

export interface ProfileFormData {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNumber: string;
  paymentDetails: PaymentDetails;
  avatarUrl: string;
}
