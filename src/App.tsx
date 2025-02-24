
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { CustomerSupport } from "./components/chat/CustomerSupport";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import EditProfile from "./pages/profile/EditProfile";
import PaymentDetails from "./pages/profile/PaymentDetails";
import Settings from "./pages/profile/Settings";
import Messages from "./pages/profile/Messages";
import RideCompare from "./pages/profile/RideCompare";
import Promotions from "./pages/profile/Promotions";
import Activity from "./pages/Activity";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import SearchResults from "./pages/SearchResults";
import RasaConfig from "./pages/profile/RasaConfig";
import "./App.css";

function App() {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/payment" element={<PaymentDetails />} />
            <Route path="/profile/settings" element={<Settings />} />
            <Route path="/profile/messages" element={<Messages />} />
            <Route path="/profile/premium" element={<RideCompare />} />
            <Route path="/profile/promotions" element={<Promotions />} />
            <Route path="/profile/rasa-config" element={<RasaConfig />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/services" element={<Services />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CustomerSupport />
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
