import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import DatasetDetail from "./pages/DatasetDetail";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import { SignIn } from "./pages/SignIn";
import { CreateBounty } from "./pages/CreateBounty";
import { AuthProvider } from "./contexts/AuthContext";
import { Bounties } from "./pages/Bounties";
import { AddContributor } from "./pages/AddContributor";
import { DistributeBounty } from "./pages/DistributeBounty";
import WalletDemo from "./pages/WalletDemo";
import MintNFT from "./pages/MintNFT";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/wizard" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/dataset/:id" element={<DatasetDetail />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/create-bounty" element={<CreateBounty />} />
            <Route path="/bounties" element={<Bounties />} />
            <Route path="/add-contributor" element={<AddContributor />} />
            <Route path="/distribute-bounty" element={<DistributeBounty />} />
            <Route path="/wallet" element={<WalletDemo />} />
            <Route path="/mint-nft" element={<MintNFT />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
