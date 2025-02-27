
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
    estimated_distance: {
      miles: number;
      kilometers: number;
    };
    estimated_duration: number;
    base_fare: number;
    distance_charge: number;
    time_charge: number;
    service_fee: number;
    surge_multiplier: number;
  };
}

async function getCoordinates(location: string): Promise<[number, number]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    const data = await response.json();
    if (data && data[0]) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    throw new Error('Location not found');
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): { miles: number; kilometers: number } {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distanceKm = R * c;
  const distanceMiles = distanceKm * 0.621371; // Convert km to miles
  
  return {
    kilometers: Number(distanceKm.toFixed(2)),
    miles: Number(distanceMiles.toFixed(2))
  };
}

// Estimate travel time based on distance and average speed
function estimateTravelTime(distanceKm: number): number {
  const averageSpeedKph = 48; // Assumed average speed in city (30mph ≈ 48kph)
  return Math.round((distanceKm / averageSpeedKph) * 60); // Convert to minutes
}

export async function getPricePrediction(pickup: string, dropoff: string): Promise<PricePrediction> {
  try {
    // Get coordinates for pickup and dropoff locations
    const [pickupCoords, dropoffCoords] = await Promise.all([
      getCoordinates(pickup),
      getCoordinates(dropoff)
    ]);

    // Calculate actual distance
    const distance = calculateDistance(
      pickupCoords[0], pickupCoords[1],
      dropoffCoords[0], dropoffCoords[1]
    );

    // Calculate estimated duration based on distance
    const duration = estimateTravelTime(distance.kilometers);
    
    const baseFare = 2.50;
    const distanceRate = 1.50; // per mile
    const timeRate = 0.30; // per minute
    const serviceFee = 2.00;
    const surgeMultiplier = Math.random() > 0.7 ? 1 + Math.random() : 1; // 30% chance of surge

    const distanceCharge = distance.miles * distanceRate;
    const timeCharge = duration * timeRate;
    const subtotal = (baseFare + distanceCharge + timeCharge + serviceFee) * surgeMultiplier;

    return {
      predicted_price: Number(subtotal.toFixed(2)),
      details: {
        estimated_distance: {
          miles: distance.miles,
          kilometers: distance.kilometers
        },
        estimated_duration: duration,
        base_fare: baseFare,
        distance_charge: Number(distanceCharge.toFixed(2)),
        time_charge: Number(timeCharge.toFixed(2)),
        service_fee: serviceFee,
        surge_multiplier: Number(surgeMultiplier.toFixed(2))
      }
    };
  } catch (error) {
    console.error('Error calculating price prediction:', error);
    throw error;
  }
}
