
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ridecompare.app',
  appName: 'ridecompare',
  webDir: 'dist',
  server: {
    url: 'http://localhost:8080',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  plugins: {
    Geolocation: {
      ios: {
        requireAlwaysAuthorization: false,
        requireDescriptions: true,
        locationWhenInUseDescription: "We need your location to find rides near you.",
        locationAlwaysDescription: "We need your location to find rides near you."
      },
      android: {
        requireLocation: true,
        requireLocationAlways: false,
        requireCoarseLocation: true,
        requireFineLocation: true
      }
    }
  }
};

export default config;
