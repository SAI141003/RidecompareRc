
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import ComingSoon from "./pages/ComingSoon";
import SearchResults from "./pages/SearchResults";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/services" element={<Services />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
