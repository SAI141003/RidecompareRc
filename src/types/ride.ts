
export interface RideOption {
  id: string;
  provider: "uber" | "lyft";
  type: string;
  capacity: number;
  price: number;
  eta: number;
  surge: boolean;
}
