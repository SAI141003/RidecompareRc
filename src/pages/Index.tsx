
import { RideSearch } from "@/components/RideSearch";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RideSearch />
      </main>
    </div>
  );
};

export default Index;
