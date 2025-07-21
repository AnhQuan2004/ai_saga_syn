import React from 'react';
import { MintMetadataNFT } from '../components/MintMetadataNFT';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '../components/ui/button';

export const MintNFT: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mint Metadata NFT</h1>
      
      {!isConnected ? (
        <div className="max-w-md mx-auto text-center p-8 bg-slate-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="mb-4">You need to connect your wallet to mint an NFT.</p>
          <Button 
            onClick={() => document.getElementById('wallet-button')?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <MintMetadataNFT />
        </div>
      )}
    </div>
  );
};

export default MintNFT; 