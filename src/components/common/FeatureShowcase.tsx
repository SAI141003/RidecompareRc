
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

interface FeatureShowcaseProps {
  features: string[];
}

export const FeatureShowcase = ({ features }: FeatureShowcaseProps) => {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [features]);

  return (
    <RouterLink to="/coming-soon">
      <Button 
        variant="outline" 
        className="group relative overflow-hidden border-2 border-purple-500 hover:border-blue-500 transition-colors"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className="mr-2 h-4 w-4 text-purple-500 group-hover:text-blue-500 transition-colors" />
        <div className="flex flex-col items-center">
          <span>Upcoming Features</span>
          <span className="text-sm text-purple-500 group-hover:text-blue-500 transition-colors animate-fade-in">
            {features[currentFeature]}
          </span>
        </div>
        <ArrowRight className="ml-2 h-4 w-4 text-purple-500 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
      </Button>
    </RouterLink>
  );
};
