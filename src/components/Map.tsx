
import React, { useEffect, useRef, useState } from 'react';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import L from 'leaflet';
import { toast } from "sonner";
import 'leaflet/dist/leaflet.css';

interface MapProps {
  pickup?: [number, number];
  dropoff?: [number, number];
}

const Map = ({ pickup, dropoff }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  // Initialize map and handle location
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const initializeMap = async () => {
      try {
        // Check location permission first
        const permissionStatus = await Geolocation.checkPermissions();
        
        if (permissionStatus.location === 'denied') {
          const newPermission = await Geolocation.requestPermissions();
          if (newPermission.location !== 'granted') {
            toast.error('Location permission is required to show your location');
            return;
          }
        }

        // Create map instance with default view
        mapRef.current = L.map(mapContainer.current).setView([40.7128, -74.0060], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);

        // Get high accuracy location
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });

        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        if (mapRef.current) {
          // Center map on user location
          mapRef.current.setView([latitude, longitude], 15);
          
          // Add user location marker with custom popup
          L.marker([latitude, longitude])
            .addTo(mapRef.current)
            .bindPopup('You are here')
            .openPopup();

          // Watch for location updates
          const watchId = await Geolocation.watchPosition(
            { enableHighAccuracy: true },
            (position, err) => {
              if (err) {
                console.error('Watch position error:', err);
                return;
              }
              if (position) {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
              }
            }
          );

          // Cleanup watch position
          return () => {
            Geolocation.clearWatch({ id: watchId });
          };
        }

      } catch (error: any) {
        toast.error(error.message || 'Could not get your location');
        console.error('Geolocation error:', error);
      }
    };

    initializeMap();

    // Cleanup map
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when pickup/dropoff points change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    // Add user location marker
    if (userLocation) {
      L.marker(userLocation)
        .addTo(mapRef.current)
        .bindPopup('You are here');
    }

    // Add pickup marker
    if (pickup) {
      L.marker(pickup)
        .addTo(mapRef.current)
        .bindPopup('Pickup location');
    }

    // Add dropoff marker
    if (dropoff) {
      L.marker(dropoff)
        .addTo(mapRef.current)
        .bindPopup('Dropoff location');
    }

    // Create an array of valid coordinates to fit bounds
    const coordinates: L.LatLngExpression[] = [];
    if (userLocation) coordinates.push(userLocation);
    if (pickup) coordinates.push(pickup);
    if (dropoff) coordinates.push(dropoff);

    // Only fit bounds if we have coordinates
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickup, dropoff, userLocation]);

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default Map;
