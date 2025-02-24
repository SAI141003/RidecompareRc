
import { Hotel, HotelSearchParams } from "@/types/hotel";

const mockHotels: Hotel[] = [
  {
    id: "1",
    name: "Grand Plaza Hotel",
    rating: 4.5,
    price: 199.99,
    currency: "USD",
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant"],
    address: "123 Main Street, City Center",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    distance: "0.5 miles from city center"
  },
  {
    id: "2",
    name: "Seaside Resort",
    rating: 4.8,
    price: 299.99,
    currency: "USD",
    amenities: ["Beachfront", "Free WiFi", "Pool", "Gym"],
    address: "456 Beach Road, Oceanfront",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    distance: "0.2 miles from beach"
  },
  {
    id: "3",
    name: "City View Inn",
    rating: 4.2,
    price: 149.99,
    currency: "USD",
    amenities: ["Free WiFi", "Restaurant", "Business Center"],
    address: "789 Downtown Ave",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
    distance: "1.0 miles from downtown"
  }
];

export const searchHotels = async (params: HotelSearchParams): Promise<Hotel[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For mock data, we'll just return all hotels
  // In a real implementation, this would filter based on the params
  return mockHotels;
};
