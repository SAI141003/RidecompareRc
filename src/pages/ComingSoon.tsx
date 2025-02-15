
import { Header } from "@/components/Header";
import { Features } from "@/components/Features";
import { Search, Navigation, MapPin, Shield, Route, Share2 } from "lucide-react";

const appServices = [
  {
    title: "Smart Routes",
    description: "AI-powered route suggestions for the best travel experience.",
    icon: <Route className="h-6 w-6 text-primary" />,
  },
  {
    title: "Real-Time Tracking",
    description: "Track your ride in real-time with accurate arrival estimates.",
    icon: <Navigation className="h-6 w-6 text-primary" />,
  },
  {
    title: "Safety Features",
    description: "Enhanced safety with live tracking and emergency support.",
    icon: <Shield className="h-6 w-6 text-primary" />,
  },
  {
    title: "Price Comparison",
    description: "Compare prices across multiple services instantly.",
    icon: <Search className="h-6 w-6 text-primary" />,
  },
  {
    title: "Location Services",
    description: "Precise pickup and drop-off location mapping.",
    icon: <MapPin className="h-6 w-6 text-primary" />,
  },
  {
    title: "Share Your Ride",
    description: "Share your ride details with friends and family.",
    icon: <Share2 className="h-6 w-6 text-primary" />,
  },
];

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Features />
      
      <div className="py-12 border-t dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 dark:from-purple-400 dark:to-blue-400">
              Core App Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover our powerful features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {appServices.map((service, index) => (
              <div
                key={index}
                className="fade-up opacity-0 glass rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 dark:bg-gray-800/50 dark:border-white/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4 dark:bg-white/5">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{service.title}</h3>
                <p className="text-muted-foreground dark:text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
