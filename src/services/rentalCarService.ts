
import { generateRandomPrice, generateRandomEta } from './priceService';

export interface RentalCarOption {
  id: string;
  provider: "enterprise" | "hertz" | "avis" | "budget" | "turo" | "sixt";
  name: string;
  model: string;
  category: "economy" | "compact" | "midsize" | "suv" | "luxury" | "minivan" | "convertible" | "electric";
  image: string;
  price: number;
  totalPrice: number;
  currency: string;
  duration: number; // in days
  location: string;
  pickupDate: string;
  returnDate: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
  special?: string;
  promotion?: string;
  unlimited_mileage: boolean;
  mileage_limit?: number; // if not unlimited
  deposit_required: boolean;
  deposit_amount?: number; // if deposit required
}

interface RentalCarSearchParams {
  pickup: string;
  dropoff?: string; // Optional, same as pickup if not specified
  pickupDate: string;
  returnDate: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  providers?: string[];
}

// Demo data for providers
const providers = [
  { id: "enterprise", name: "Enterprise", logo: "enterprise-logo.png", rating: 4.3, reviewCount: 2456 },
  { id: "hertz", name: "Hertz", logo: "hertz-logo.png", rating: 4.1, reviewCount: 3201 },
  { id: "avis", name: "Avis", logo: "avis-logo.png", rating: 4.0, reviewCount: 1845 },
  { id: "budget", name: "Budget", logo: "budget-logo.png", rating: 3.9, reviewCount: 1256 },
  { id: "turo", name: "Turo", logo: "turo-logo.png", rating: 4.5, reviewCount: 3567 },
  { id: "sixt", name: "Sixt", logo: "sixt-logo.png", rating: 4.2, reviewCount: 2134 }
];

// Demo data for car categories
const carCategories = [
  { id: "economy", name: "Economy", description: "Fuel-efficient, compact cars" },
  { id: "compact", name: "Compact", description: "Small but spacious vehicles" },
  { id: "midsize", name: "Midsize", description: "Balanced comfort and economy" },
  { id: "suv", name: "SUV", description: "Spacious vehicles with cargo space" },
  { id: "luxury", name: "Luxury", description: "Premium vehicles with extra features" },
  { id: "minivan", name: "Minivan", description: "Larger vehicles for groups" },
  { id: "convertible", name: "Convertible", description: "Open-top vehicles" },
  { id: "electric", name: "Electric", description: "Eco-friendly electric vehicles" }
];

// Demo car models by category
const carModels = {
  economy: ["Toyota Yaris", "Nissan Versa", "Kia Rio", "Hyundai Accent", "Chevrolet Spark"],
  compact: ["Toyota Corolla", "Honda Civic", "Nissan Sentra", "Ford Focus", "Mazda 3"],
  midsize: ["Toyota Camry", "Honda Accord", "Nissan Altima", "Hyundai Sonata", "Kia Optima"],
  suv: ["Toyota RAV4", "Honda CR-V", "Jeep Cherokee", "Ford Escape", "Nissan Rogue"],
  luxury: ["BMW 3 Series", "Mercedes C-Class", "Audi A4", "Lexus ES", "Cadillac CT5"],
  minivan: ["Chrysler Pacifica", "Honda Odyssey", "Toyota Sienna", "Kia Sedona", "Dodge Grand Caravan"],
  convertible: ["Ford Mustang Convertible", "Chevrolet Camaro Convertible", "BMW 4 Series Convertible", "Mazda MX-5 Miata", "Mini Cooper Convertible"],
  electric: ["Tesla Model 3", "Nissan Leaf", "Chevrolet Bolt", "Hyundai Kona Electric", "Kia Niro EV"]
};

// Sample amenities
const possibleAmenities = [
  "GPS", "Bluetooth", "Backup Camera", "USB Charging", "Heated Seats", 
  "Sunroof", "Apple CarPlay", "Android Auto", "Satellite Radio", "Cruise Control",
  "Keyless Entry", "Roof Rack", "Ski Rack", "Child Seat", "WiFi Hotspot"
];

// Special offers and promotions
const specialOffers = [
  "10% off for weekend rentals",
  "Free upgrade to next car class",
  "Free additional driver",
  "No young driver fee",
  "50% off GPS rental",
  "Earn double points",
  "Free child seat"
];

// Function to calculate rental duration in days
function calculateDurationDays(pickupDate: string, returnDate: string): number {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Ensure at least 1 day
}

// Function to generate a random price per day based on car category
function generateBasePricePerDay(category: string): number {
  const basePrices: Record<string, number> = {
    economy: 35,
    compact: 40,
    midsize: 50,
    suv: 65,
    luxury: 95,
    minivan: 80,
    convertible: 85,
    electric: 75
  };
  
  const basePrice = basePrices[category as keyof typeof basePrices] || 45;
  return generateRandomPrice(basePrice);
}

// Get rental car options based on search parameters
export async function getRentalCarOptions(params: RentalCarSearchParams): Promise<RentalCarOption[]> {
  console.log("Fetching rental car options with params:", params);
  
  // Calculate duration in days
  const duration = calculateDurationDays(params.pickupDate, params.returnDate);
  
  // Create mock data for car options
  const options: RentalCarOption[] = [];
  
  // Generate options for each provider
  providers.forEach(provider => {
    // Filter by provider if specified
    if (params.providers && params.providers.length > 0 && !params.providers.includes(provider.id)) {
      return;
    }
    
    // Generate 1-3 options per provider
    const numOptions = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numOptions; i++) {
      // Randomly select a category, favoring the requested category if specified
      let category: string;
      if (params.category && Math.random() > 0.3) {
        category = params.category;
      } else {
        category = carCategories[Math.floor(Math.random() * carCategories.length)].id;
      }
      
      // Select a random model from the category
      const availableModels = carModels[category as keyof typeof carModels] || carModels.economy;
      const model = availableModels[Math.floor(Math.random() * availableModels.length)];
      
      // Generate price
      const pricePerDay = generateBasePricePerDay(category);
      const totalPrice = pricePerDay * duration;
      
      // Filter by price if specified
      if ((params.minPrice && totalPrice < params.minPrice) || 
          (params.maxPrice && totalPrice > params.maxPrice)) {
        continue;
      }
      
      // Generate random amenities (3-5 items)
      const numAmenities = Math.floor(Math.random() * 3) + 3;
      const amenities = [];
      const amenitiesCopy = [...possibleAmenities];
      for (let j = 0; j < numAmenities; j++) {
        if (amenitiesCopy.length === 0) break;
        const index = Math.floor(Math.random() * amenitiesCopy.length);
        amenities.push(amenitiesCopy[index]);
        amenitiesCopy.splice(index, 1);
      }
      
      // Decide if there's a special offer (30% chance)
      let special = undefined;
      if (Math.random() < 0.3) {
        special = specialOffers[Math.floor(Math.random() * specialOffers.length)];
      }
      
      // Decide if unlimited mileage
      const unlimitedMileage = Math.random() > 0.3;
      
      // Generate option
      options.push({
        id: `${provider.id}-${category}-${i}`,
        provider: provider.id as any,
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Car`,
        model,
        category: category as any,
        image: `${category.toLowerCase()}.jpg`,
        price: pricePerDay,
        totalPrice,
        currency: "USD",
        duration,
        location: params.pickup,
        pickupDate: params.pickupDate,
        returnDate: params.returnDate,
        amenities,
        rating: provider.rating + (Math.random() * 0.4 - 0.2), // slight variation in rating
        reviewCount: provider.reviewCount,
        special,
        unlimited_mileage: unlimitedMileage,
        mileage_limit: unlimitedMileage ? undefined : Math.floor(Math.random() * 150) + 100,
        deposit_required: Math.random() > 0.5,
        deposit_amount: Math.random() > 0.5 ? Math.floor(Math.random() * 300) + 200 : undefined
      });
    }
  });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return options;
}

// Predict price trends for rental cars
export async function predictRentalPriceTrend(location: string, pickupDate: string, category: string): Promise<{
  trend: "rising" | "falling" | "stable";
  percentage?: number;
  message: string;
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Randomly generate a trend prediction
  const random = Math.random();
  
  if (random < 0.33) {
    const percentage = Math.floor(Math.random() * 15) + 5;
    return {
      trend: "rising",
      percentage,
      message: `Prices expected to rise by ~${percentage}% in the next 7 days.`
    };
  } else if (random < 0.66) {
    const percentage = Math.floor(Math.random() * 10) + 3;
    return {
      trend: "falling",
      percentage,
      message: `Prices expected to drop by ~${percentage}% in the next 7 days.`
    };
  } else {
    return {
      trend: "stable",
      message: "Prices expected to remain stable in the next 7 days."
    };
  }
}

// Get popular rental locations near a given location
export async function getNearbyRentalLocations(location: string): Promise<Array<{
  id: string;
  name: string;
  address: string;
  distance: number; // in miles
  providers: string[];
}>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate 3-5 nearby locations
  const numLocations = Math.floor(Math.random() * 3) + 3;
  const locations = [];
  
  for (let i = 0; i < numLocations; i++) {
    // Randomly select 3-6 providers for this location
    const numProviders = Math.floor(Math.random() * 4) + 3;
    const locationProviders = [];
    const providersCopy = [...providers];
    
    for (let j = 0; j < numProviders; j++) {
      if (providersCopy.length === 0) break;
      const index = Math.floor(Math.random() * providersCopy.length);
      locationProviders.push(providersCopy[index].id);
      providersCopy.splice(index, 1);
    }
    
    // Generate location
    locations.push({
      id: `location-${i}`,
      name: i === 0 ? `${location} Airport` : 
            i === 1 ? `Downtown ${location}` : 
            `${location} - ${["North", "South", "East", "West"][i % 4]} Side`,
      address: `${Math.floor(Math.random() * 9000) + 1000} ${["Main St", "Airport Rd", "City Center", "Broadway Ave"][i % 4]}, ${location}`,
      distance: Math.floor(Math.random() * 15) + (i * 2),
      providers: locationProviders
    });
  }
  
  return locations.sort((a, b) => a.distance - b.distance);
}

// Deep link generation function
export function generateDeepLink(option: RentalCarOption): string {
  const baseUrls: Record<string, string> = {
    enterprise: "https://www.enterprise.com/en/reserve.html",
    hertz: "https://www.hertz.com/rentacar/reservation",
    avis: "https://www.avis.com/en/reservation",
    budget: "https://www.budget.com/en/reservation",
    turo: "https://turo.com/us/en/search",
    sixt: "https://www.sixt.com/car-rental"
  };

  const baseUrl = baseUrls[option.provider] || "";
  
  // In a real implementation, we would add query parameters specific to each provider
  return baseUrl;
}
