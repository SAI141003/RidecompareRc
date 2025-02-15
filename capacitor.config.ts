
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.63baf6efde464be59bca3882166612e0',
  appName: 'ridecompare',
  webDir: 'dist',
  server: {
    url: 'https://63baf6ef-de46-4be5-9bca-3882166612e0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  }
};

export default config;
