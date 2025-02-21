
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
      name: "UberX",
      capacity: 4,
      price: 15.99,
      eta: 5,
      time: 3,
      surge: false,
      pickup_location: pickup,
      dropoff_location: dropoff
    },
    {
      id: "uber-xl",
      provider: "uber",
      type: "UberXL",
      name: "UberXL",
      capacity: 6,
      price: 25.99,
      eta: 8,
      time: 5,
      surge: false,
      pickup_location: pickup,
      dropoff_location: dropoff
    },
    {
      id: "lyft-standard",
      provider: "lyft",
      type: "Lyft",
      name: "Lyft Standard",
      capacity: 4,
      price: 14.99,
      eta: 4,
      time: 2,
      surge: false,
      pickup_location: pickup,
      dropoff_location: dropoff
    },
    {
      id: "lyft-xl",
      provider: "lyft",
      type: "Lyft XL",
      name: "Lyft XL",
      capacity: 6,
      price: 24.99,
      eta: 7,
      time: 4,
      surge: false,
      pickup_location: pickup,
      dropoff_location: dropoff
    },
  ];
};
