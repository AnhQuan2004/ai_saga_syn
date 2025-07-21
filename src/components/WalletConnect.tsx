import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Button } from './ui/button';

export const WalletConnect: React.FC = () => {
  const { 
    address, 
    balance, 
    chainId, 
    connectWallet, 
    disconnectWallet, 
    isConnected, 
    isConnecting,
    networkName,
    error
  } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col gap-2">
      {!isConnected ? (
        <Button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      ) : (
        <div className="flex flex-col gap-2 p-4 border rounded-lg bg-slate-50">
          <div className="flex justify-between items-center">
            <span className="font-medium">Address:</span>
            <span className="font-mono">{formatAddress(address!)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Balance:</span>
            <span>{parseFloat(balance).toFixed(4)} {networkName.split(' ')[0]}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Network:</span>
            <span>{networkName}</span>
          </div>
          <Button 
            onClick={disconnectWallet}
            variant="outline"
            className="mt-2"
          >
            Disconnect
          </Button>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
}; 