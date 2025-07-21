import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { donateToCreator } from "@/utils/contractUtils";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from "ethers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NFTMetadata {
  tokenId: number;
  source_url: string;
  content_hash: string;
  content_link: string;
  embed_vector_id: string;
  created_at: number;
  tags: string[];
  owner: string;
  tokenURI: string;
  name: string;
  description: string;
}

export const NFTMarketplace = () => {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signer, isConnected, isCorrectNetwork } = useWallet();
  const [donationAmount, setDonationAmount] = useState("");
  const [selectedNftId, setSelectedNftId] = useState<number | null>(null);
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [donationLoading, setDonationLoading] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [donationSuccess, setDonationSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/metadata/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }
        const data = await response.json();
        if (data.success) {
          const filteredNfts = data.metadata.filter(
            (nft: NFTMetadata) => true
          );
          setNfts(filteredNfts);
        } else {
          throw new Error(data.message || "Failed to fetch metadata");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const handleDonate = (tokenId: number) => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!isCorrectNetwork) {
      setError("Please switch to the QSaga network");
      return;
    }
    
    setSelectedNftId(tokenId);
    setDonationAmount("");
    setDonationError(null);
    setDonationSuccess(null);
    setIsDonateDialogOpen(true);
  };

  const handleDonationSubmit = async () => {
    if (!selectedNftId || !signer) return;
    
    try {
      setDonationLoading(true);
      setDonationError(null);
      
      // Validate amount
      if (!donationAmount || parseFloat(donationAmount) <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(donationAmount);
      
      // Call the donate function
      const result = await donateToCreator(signer, selectedNftId, amountInWei);
      
      setDonationSuccess(`Successfully donated ${donationAmount} QSG! Transaction hash: ${result.txHash}`);
      
      // Close dialog after 3 seconds of showing success
      setTimeout(() => {
        setIsDonateDialogOpen(false);
        setDonationSuccess(null);
      }, 3000);
      
    } catch (err: any) {
      console.error("Donation error:", err);
      
      // Safely check error messages
      const errorMessage = err && typeof err === 'object' ? 
        (typeof err.message === 'string' ? err.message : String(err)) : 
        String(err);
      
      if (errorMessage.includes("user rejected")) {
        setDonationError("Transaction was rejected by the user");
      } else if (errorMessage.includes("insufficient funds")) {
        setDonationError("Insufficient funds in your wallet");
      } else {
        setDonationError("Failed to process donation. Please check your wallet and try again.");
      }
    } finally {
      setDonationLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dataset</h1>
          <p className="text-muted-foreground">
            Browse and explore generated datasets
          </p>
        </div>
      </div>

      {loading && <p>Loading datasets...</p>}
      
      {error && (
         <Alert variant="destructive">
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <Card
              key={nft.tokenId}
              className="shadow-card hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleDonate(nft.tokenId)}
                  title="Support the creator"
                >
                  <Coffee className="w-4 h-4" />
                </Button>
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2" title={nft.name}>
                  {nft.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-1 flex-grow flex flex-col justify-between">
                <div>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{nft.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(nft.tags || []).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      Created:{" "}
                      {new Date(nft.created_at * 1000).toLocaleDateString()}
                    </p>
                    <p className="truncate" title={nft.owner}>
                      Owner: {nft.owner}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(nft.content_link, "_blank")}
                  className="w-full mt-4"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Dataset
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Donation Dialog */}
      <Dialog open={isDonateDialogOpen} onOpenChange={setIsDonateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Support the Creator</DialogTitle>
            <DialogDescription>
              Enter the amount you would like to donate to the creator of this dataset.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.01"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  QSG
                </span>
              </div>
            </div>
            
            {donationError && (
              <Alert variant="destructive">
                <AlertDescription>{donationError}</AlertDescription>
              </Alert>
            )}
            
            {donationSuccess && (
              <Alert>
                <AlertDescription>{donationSuccess}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDonateDialogOpen(false)}
              disabled={donationLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDonationSubmit} 
              disabled={donationLoading || !donationAmount}
            >
              {donationLoading ? "Processing..." : "Donate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
