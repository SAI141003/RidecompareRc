
export interface PaymentDetails {
  cardNumber: string;
  cardExpiry: string;
  cardCVV?: string;
}

export interface Address {
  id?: string;
  addressType: 'home' | 'work' | 'preferred';
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface ProfileFormData {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNumber: string;
  paymentDetails: PaymentDetails;
  avatarUrl: string;
  addresses: Address[];
}
