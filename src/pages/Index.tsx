
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-up");
        }
      });
    });

    document.querySelectorAll(".fade-up").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center hero-pattern overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 fade-up opacity-0">
            <span className="inline-block px-4 py-1.5 text-sm font-medium bg-secondary rounded-full animate-fade-in">
              Welcome to the future
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Create something
              <span className="block text-primary">extraordinary</span>
            </h1>
            <p className="max-w-lg mx-auto text-muted-foreground text-lg">
              Experience the perfect blend of form and function in every interaction.
            </p>
            <button className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-up opacity-0">
            <h2 className="text-3xl font-bold">Features</h2>
            <p className="mt-4 text-muted-foreground">
              Discover what makes our platform unique
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

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up opacity-0">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">
              Join us in creating the next generation of digital experiences.
            </p>
            <button className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors duration-200">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    title: "Intuitive Design",
    description: "Experience a user interface that feels natural and effortless.",
    icon: <ArrowRight className="h-6 w-6 text-primary" />,
  },
  {
    title: "Powerful Features",
    description: "Access advanced capabilities with just a few clicks.",
    icon: <ArrowRight className="h-6 w-6 text-primary" />,
  },
  {
    title: "Seamless Integration",
    description: "Connect and extend functionality with ease.",
    icon: <ArrowRight className="h-6 w-6 text-primary" />,
  },
];

export default Index;
