
import { Plane, UtensilsCrossed, Car, ShoppingCart, Truck } from "lucide-react";

const features = [
  {
    title: "Google Flights",
    description: "Find and compare flight prices across multiple airlines in real-time.",
    icon: <Plane className="h-6 w-6 text-primary" />,
  },
  {
    title: "Uber Eats & DoorDash",
    description: "Compare food delivery prices and delivery times from multiple services.",
    icon: <UtensilsCrossed className="h-6 w-6 text-primary" />,
  },
  {
    title: "Skip",
    description: "Access local delivery options with real-time tracking and competitive pricing.",
    icon: <Car className="h-6 w-6 text-primary" />,
  },
  {
    title: "Instacart",
    description: "Compare grocery delivery prices and get the best deals on your shopping.",
    icon: <ShoppingCart className="h-6 w-6 text-primary" />,
  },
];

export const Features = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 dark:from-purple-400 dark:to-blue-400">
            Upcoming Integrations
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Exciting new services coming soon to RideCompare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      </div>
    </div>
  );
};
