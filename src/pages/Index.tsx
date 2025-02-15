
import { RideSearch } from "@/components/RideSearch";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-6 mb-12 animate-fade-up">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-xl flex items-center justify-center">
            <span className="text-4xl font-bold text-white">AV</span>
          </div>
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to AppVenture
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-md">
            Your journey begins here. Find and book rides to your destination with ease.
          </p>
        </div>
        <RideSearch />
      </main>
    </div>
  );
};

export default Index;
