
import React, { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
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
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Initialize map and handle location
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const initializeMap = async () => {
      try {
        // Check location permission
        const permissionStatus = await Geolocation.checkPermissions();
        
        if (permissionStatus.location === 'denied') {
          const newPermission = await Geolocation.requestPermissions();
          if (newPermission.location !== 'granted') {
            toast.error('Location permission is required');
            return;
          }
        }

        // Create map instance
        mapRef.current = L.map(mapContainer.current).setView([40.7128, -74.0060], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);

        // Get user location
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });

        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
          L.marker([latitude, longitude])
            .addTo(mapRef.current)
            .bindPopup('You are here')
            .openPopup();
        }
      } catch (error: any) {
        toast.error('Could not get your location');
        console.error('Geolocation error:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers and route when pickup/dropoff points change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers and route
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
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

    // Draw route if both pickup and dropoff are set
    if (pickup && dropoff) {
      const fetchRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${dropoff[1]},${dropoff[0]}?overview=full&geometries=geojson`
          );
          const data = await response.json();
          
          if (data.routes && data.routes[0]) {
            const coordinates = data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]]
            );
            
            if (routeLayerRef.current) {
              routeLayerRef.current.remove();
            }
            
            routeLayerRef.current = L.polyline(coordinates, {
              color: 'blue',
              weight: 4,
              opacity: 0.7
            }).addTo(mapRef.current!);
          }
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      };

      fetchRoute();
    }

    // Fit map bounds to show all points
    const coordinates: L.LatLngExpression[] = [];
    if (userLocation) coordinates.push(userLocation);
    if (pickup) coordinates.push(pickup);
    if (dropoff) coordinates.push(dropoff);

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
