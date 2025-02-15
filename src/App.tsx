
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "next-themes";
import { BottomNav } from "@/components/BottomNav";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Features from "@/pages/Features";
import Services from "@/pages/Services";
import SearchResults from "@/pages/SearchResults";
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <AuthProvider>
          <div className="pb-16"> {/* Add padding for bottom nav */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/features" element={<Features />} />
              <Route path="/services" element={<Services />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <BottomNav />
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
