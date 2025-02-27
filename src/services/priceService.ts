
// Helper function to generate slightly random prices
export function generateRandomPrice(basePrice: number): number {
  const variation = basePrice * 0.2; // 20% variation
  const randomChange = (Math.random() - 0.5) * variation;
  return Number((basePrice + randomChange).toFixed(2));
}

// Helper function to generate slightly random ETAs
export function generateRandomEta(baseEta: number): number {
  const variation = 2; // +/- 2 minutes
  const randomChange = Math.floor((Math.random() - 0.5) * variation * 2);
  return baseEta + randomChange;
}

interface PricePrediction {
  predicted_price: number;
  details?: {
    estimated_distance: number;
    estimated_duration: number;
    base_fare: number;
    distance_charge: number;
    time_charge: number;
    service_fee: number;
    surge_multiplier: number;
  };
}

export async function getPricePrediction(pickup: string, dropoff: string): Promise<PricePrediction> {
  // In demo mode, generate a realistic-looking price prediction
  const baseDistance = 5; // miles
  const baseDuration = 15; // minutes
  const variation = 0.3; // 30% random variation

  const distance = baseDistance * (1 + (Math.random() - 0.5) * variation);
  const duration = Math.round(baseDuration * (1 + (Math.random() - 0.5) * variation));
  
  const baseFare = 2.50;
  const distanceRate = 1.50; // per mile
  const timeRate = 0.30; // per minute
  const serviceFee = 2.00;
  const surgeMultiplier = Math.random() > 0.7 ? 1 + Math.random() : 1; // 30% chance of surge

  const distanceCharge = distance * distanceRate;
  const timeCharge = duration * timeRate;
  const subtotal = (baseFare + distanceCharge + timeCharge + serviceFee) * surgeMultiplier;

  return {
    predicted_price: Number(subtotal.toFixed(2)),
    details: {
      estimated_distance: Number(distance.toFixed(2)),
      estimated_duration: duration,
      base_fare: baseFare,
      distance_charge: Number(distanceCharge.toFixed(2)),
      time_charge: Number(timeCharge.toFixed(2)),
      service_fee: serviceFee,
      surge_multiplier: Number(surgeMultiplier.toFixed(2))
    }
  };
}
