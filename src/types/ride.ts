
export interface RideOption {
  id: string;
  provider: "uber" | "lyft";
  type: string;
  capacity: number;
  price: number;
  eta: number;
  surge: boolean;
  name: string;
  time: number;
  pickup_location: string;
  dropoff_location: string;
  selected?: boolean;
}
