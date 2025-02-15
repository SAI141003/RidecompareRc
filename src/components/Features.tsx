
import { MapPin, Navigation, Search, Clock, Package, Rocket } from "lucide-react";

const features = [
  {
    title: "Compare Rides",
    description: "Compare prices across multiple ride-sharing services in real-time.",
    icon: <Search className="h-6 w-6 text-primary" />,
  },
  {
    title: "Track Rides",
    description: "Get accurate arrival times and track your ride in real-time.",
    icon: <Navigation className="h-6 w-6 text-primary" />,
  },
  {
    title: "Smart Routes",
    description: "AI-powered route suggestions for the best travel experience.",
    icon: <MapPin className="h-6 w-6 text-primary" />,
  },
];

const comingSoonFeatures = [
  {
    title: "Scheduled Rides",
    description: "Plan ahead by scheduling your rides in advance.",
    icon: <Clock className="h-6 w-6 text-primary" />,
  },
  {
    title: "Group Rides",
    description: "Share rides with friends and split costs automatically.",
    icon: <Package className="h-6 w-6 text-primary" />,
  },
  {
    title: "Express Pickup",
    description: "Premium service for faster pickups and priority matching.",
    icon: <Rocket className="h-6 w-6 text-primary" />,
  },
];

export const Features = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 dark:from-purple-400 dark:to-blue-400">
            Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover what RideCompare has to offer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="fade-up opacity-0 glass rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 dark:bg-gray-800/50 dark:border-white/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4 dark:bg-white/5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-muted-foreground dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 dark:from-purple-400 dark:to-blue-400">
            Coming Soon
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Exciting new features on the horizon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {comingSoonFeatures.map((feature, index) => (
            <div
              key={index}
              className="fade-up opacity-0 glass rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 dark:bg-gray-800/50 dark:border-white/10"
              style={{ animationDelay: `${(index + features.length) * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4 dark:bg-white/5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-muted-foreground dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
