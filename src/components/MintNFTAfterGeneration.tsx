import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { mintMetadataNFT } from "@/utils/contractUtils";
import { useWallet } from "@/contexts/WalletContext";
import { ethers } from "ethers";

interface MintNFTAfterGenerationProps {
  apiResponse: {
    success: boolean;
    message: string;
    data: any;
    metadata: {
      name: string;
      description: string;
      contentHash: string;
      sourceUrl: string;
      contentLink: string;
      embedVectorId: string;
      createdAt: number;
      tags: string[];
    };
    irys_links: {
      content_url: string;
      metadata_url: string;
    };
  };
  onMintSuccess?: (tokenId: string) => void;
  onMintError?: (error: Error) => void;
}

type MintStatus = 'idle' | 'minting' | 'success' | 'error';

export const MintNFTAfterGeneration = ({ 
  apiResponse, 
  onMintSuccess, 
  onMintError 
}: MintNFTAfterGenerationProps) => {
  const [mintStatus, setMintStatus] = useState<MintStatus>('idle');
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { signer, isConnected, isCorrectNetwork } = useWallet();

  const handleMint = async () => {
    if (!signer || !isConnected) {
      setError('Please connect your wallet to mint an NFT');
      setMintStatus('error');
      if (onMintError) onMintError(new Error('Wallet not connected'));
      return;
    }

    if (!isCorrectNetwork) {
      setError('Please switch to the QSaga network to mint an NFT');
      setMintStatus('error');
      if (onMintError) onMintError(new Error('Wrong network'));
      return;
    }

    try {
      setMintStatus('minting');
      setError(null);

      const { metadata, irys_links } = apiResponse;
      
      // Prepare metadata for minting
      const nftMetadata = {
        sourceUrl: metadata.sourceUrl || irys_links.content_url,
        contentHash: metadata.contentHash || ethers.utils.id(JSON.stringify(apiResponse.data)),
        contentLink: metadata.contentLink || irys_links.content_url,
        embedVectorId: metadata.embedVectorId || '',
        createdAt: metadata.createdAt || Math.floor(Date.now() / 1000),
        tags: metadata.tags || ['dataset', 'synthetic', 'medical'],
        tokenURI: irys_links.metadata_url
      };

      // Call the mintMetadataNFT function
      const result = await mintMetadataNFT(signer, nftMetadata);
      
      if (result && result.tokenId) {
        setTokenId(result.tokenId);
        setMintStatus('success');
        if (onMintSuccess) onMintSuccess(result.tokenId);
      } else {
        throw new Error('Failed to mint NFT: No token ID returned');
      }
    } catch (err: any) {
      console.error('Error minting NFT:', err);
      setError(err.message || 'Failed to mint NFT');
      setMintStatus('error');
      if (onMintError) onMintError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Mint Dataset as NFT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mintStatus === 'idle' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your dataset has been successfully generated. Now you can mint it as an NFT on the blockchain to claim ownership.
            </p>
            <Button 
              onClick={handleMint} 
              className="w-full bg-gradient-to-r from-primary to-primary-glow"
            >
              Mint NFT
            </Button>
          </div>
        )}

        {mintStatus === 'minting' && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p>Minting your NFT... Please confirm the transaction in your wallet.</p>
          </div>
        )}

        {mintStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success!</AlertTitle>
            <AlertDescription className="text-green-800">
              Your dataset has been minted as NFT #{tokenId}. You can view it in the marketplace.
            </AlertDescription>
          </Alert>
        )}

        {mintStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-800">
              {error || 'Failed to mint NFT. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {mintStatus === 'success' && (
          <Button 
            onClick={() => window.location.href = '/marketplace'}
            className="w-full"
          >
            View in Marketplace
          </Button>
        )}

        {mintStatus === 'error' && (
          <Button 
            onClick={() => {
              setMintStatus('idle');
              setError(null);
            }}
            variant="outline"
            className="w-full"
          >
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}; 