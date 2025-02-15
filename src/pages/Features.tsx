
import { Features } from "@/components/Features";
import { Header } from "@/components/Header";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <Header />
      <Features />
    </div>
  );
};

export default FeaturesPage;
