
export interface HotelSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  price: number;
  currency: string;
  amenities: string[];
  address: string;
  image?: string;
  distance?: string;
}
