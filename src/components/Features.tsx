
import { MapPin, Navigation, Search, Plane, Utensils, ShoppingCart } from "lucide-react";

const currentFeatures = [
  {
    title: "Best Prices",
    description: "Compare prices across multiple ride-sharing services in real-time.",
    icon: <Search className="h-6 w-6 text-primary" />,
  },
  {
    title: "Real-Time ETAs",
    description: "Get accurate arrival times and track your ride in real-time.",
    icon: <Navigation className="h-6 w-6 text-primary" />,
  },
  {
    title: "Smart Routes",
    description: "AI-powered route suggestions for the best travel experience.",
    icon: <MapPin className="h-6 w-6 text-primary" />,
  },
];

const upcomingFeatures = [
  {
    title: "Flight Comparison",
    description: "Compare flight prices with Google Flights integration.",
    icon: <Plane className="h-6 w-6 text-primary" />,
  },
  {
    title: "Food Delivery",
    description: "Order food from Uber Eats, DoorDash, and Skip the Dishes.",
    icon: <Utensils className="h-6 w-6 text-primary" />,
  },
  {
    title: "Grocery Delivery",
    description: "Get groceries delivered with Instacart integration.",
    icon: <ShoppingCart className="h-6 w-6 text-primary" />,
  },
];

export const Features = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Features
          </h2>
          <p className="text-lg text-gray-600">
            Discover what RideCompare has to offer
          </p>
        </div>

        <section className="mb-20">
          <h3 className="text-2xl font-semibold text-center mb-8">Current Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentFeatures.map((feature, index) => (
              <div
                key={index}
                className="fade-up opacity-0 glass rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-center mb-8">Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <div
                key={index}
                className="fade-up opacity-0 glass rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
