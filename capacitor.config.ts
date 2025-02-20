
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ridecomparerce.app',
  appName: 'RidecompareRc',
  webDir: 'dist',
  server: {
    url: 'http://localhost:8080',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
    scheme: 'RidecompareRc',
    limitsNavigationsToAppBoundDomains: true
  },
  plugins: {
    Geolocation: {
      ios: {
        requireAlwaysAuthorization: false,
        requireDescriptions: true,
        locationWhenInUseDescription: "We need your location to find rides near you.",
        locationAlwaysDescription: "We need your location to find rides near you."
      }
    }
  }
};

export default config;
