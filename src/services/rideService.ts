
import type { RideOption } from "@/types/ride";

export const fetchRideOptions = async (pickup: string, dropoff: string): Promise<RideOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock ride options
  return [
    {
      id: "uber-x",
      provider: "uber",
      type: "UberX",
      capacity: 4,
      price: 25.99,
      eta: 5,
      surge: false,
    },
    {
      id: "uber-xl",
      provider: "uber",
      type: "UberXL",
      capacity: 6,
      price: 35.99,
      eta: 8,
      surge: true,
    },
    {
      id: "lyft-standard",
      provider: "lyft",
      type: "Lyft",
      capacity: 4,
      price: 24.99,
      eta: 4,
      surge: false,
    },
    {
      id: "lyft-xl",
      provider: "lyft",
      type: "Lyft XL",
      capacity: 6,
      price: 34.99,
      eta: 7,
      surge: true,
    },
  ];
};
