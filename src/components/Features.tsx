
import { MapPin, Navigation, Search } from "lucide-react";

const features = [
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

export const Features = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-up opacity-0">
          <h2 className="text-3xl font-bold">Why Choose RideCompare?</h2>
          <p className="mt-4 text-muted-foreground">
            Compare prices and find the best ride for your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
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
      </div>
    </section>
  );
};
