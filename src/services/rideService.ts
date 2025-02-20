
import type { RideOption } from "@/types/ride";

export const fetchRideOptions = async (pickup: string, dropoff: string): Promise<RideOption[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Base prices that will be adjusted by surge multiplier
  return [
    {
      id: "uber-x",
      provider: "uber",
      type: "UberX",
      capacity: 4,
      price: 15.99,
      eta: 5,
      surge: false,
    },
    {
      id: "uber-xl",
      provider: "uber",
      type: "UberXL",
      capacity: 6,
      price: 25.99,
      eta: 8,
      surge: false,
    },
    {
      id: "lyft-standard",
      provider: "lyft",
      type: "Lyft",
      capacity: 4,
      price: 14.99,
      eta: 4,
      surge: false,
    },
    {
      id: "lyft-xl",
      provider: "lyft",
      type: "Lyft XL",
      capacity: 6,
      price: 24.99,
      eta: 7,
      surge: false,
    },
  ];
};
