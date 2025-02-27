
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
