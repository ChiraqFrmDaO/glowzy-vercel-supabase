import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicProfile from "./pages/PublicProfile";
import Casino from "./pages/Casino";
import Partners from "./pages/Partners";
import Leaderboard from "./pages/Leaderboard";
import Pricing from "./pages/Pricing";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Analytics from "./pages/dashboard/Analytics";
import Badges from "./pages/dashboard/Badges";
import SettingsPage from "./pages/dashboard/SettingsPage";
import Customize from "./pages/dashboard/Customize";
import Links from "./pages/dashboard/Links";
import Premium from "./pages/dashboard/Premium";
import ImageHost from "./pages/dashboard/ImageHost";
import Templates from "./pages/dashboard/Templates";
import TemplateDetail from "./pages/dashboard/TemplateDetail";
import NotFound from "./pages/NotFound";
import Coins from "./pages/Coins";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/pricing/coins" element={<Coins />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="badges" element={<Badges />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="customize" element={<Customize />} />
              <Route path="links" element={<Links />} />
              <Route path="premium" element={<Premium />} />
              <Route path="image-host" element={<ImageHost />} />
              <Route path="templates" element={<Templates />} />
              <Route path="templates/:id" element={<TemplateDetail />} />
            </Route>
            <Route path="/casino" element={<Casino />} />
            <Route path="/:username" element={<PublicProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
