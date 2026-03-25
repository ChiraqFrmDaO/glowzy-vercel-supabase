import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/local/AuthProvider";
import Landing from "./pages/Landing";
import LoginLocal from "./pages/LoginLocal";
import PublicProfile from "./pages/PublicProfile";
import DashboardLayout from "./components/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Analytics from "./pages/dashboard/Analytics";
import Badges from "./pages/dashboard/Badges";
import SettingsPage from "./pages/dashboard/SettingsPage";
import Customize from "./pages/dashboard/Customize";
import Links from "./pages/dashboard/Links";
import Premium from "./pages/dashboard/Premium";
import ImageHostLocal from "./pages/dashboard/ImageHostLocal";
import Templates from "./pages/dashboard/Templates";
import DatabaseView from "./pages/DatabaseView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLocal = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginLocal />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="badges" element={<Badges />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="customize" element={<Customize />} />
              <Route path="links" element={<Links />} />
              <Route path="premium" element={<Premium />} />
              <Route path="image-host" element={<ImageHostLocal />} />
              <Route path="templates" element={<Templates />} />
            </Route>
            <Route path="/:username" element={<PublicProfile />} />
            <Route path="/database" element={<DatabaseView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default AppLocal;
