
import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface Location {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: [number, number]) => void;
  className?: string;
}

export const LocationSearch = ({
  placeholder,
  value,
  onChange,
  onLocationSelect,
  className
}: LocationSearchProps) => {
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      // Using Photon, which is based on OpenStreetMap data but with better CORS support
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      // Transform Photon response to match our Location interface
      const transformedData = data.features.map((feature: any) => ({
        display_name: feature.properties.name 
          + (feature.properties.city ? `, ${feature.properties.city}` : '')
          + (feature.properties.state ? `, ${feature.properties.state}` : '')
          + (feature.properties.country ? `, ${feature.properties.country}` : ''),
        lat: feature.geometry.coordinates[1].toString(),
        lon: feature.geometry.coordinates[0].toString()
      }));
      
      setSuggestions(transformedData);
    } catch (error) {
      console.error('Location search error:', error);
      toast.error('Error searching for locations');
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      searchLocation(value);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          className={`pl-12 ${className}`}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay hiding suggestions to allow click events to fire
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => {
                onChange(suggestion.display_name);
                onLocationSelect([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
                setShowSuggestions(false);
              }}
            >
              {suggestion.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
