import React from 'react';
import { WalletConnect } from '../components/WalletConnect';
import { SignMessage } from '../components/SignMessage';
import { SendTransaction } from '../components/SendTransaction';
import { NetworkSwitcher } from '../components/NetworkSwitcher';
import { CustomNetworkForm } from '../components/CustomNetworkForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export const WalletDemo: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wallet Connection Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
          <WalletConnect />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Switch Network</h2>
          <Card>
            <CardHeader>
              <CardTitle>Network Selection</CardTitle>
              <CardDescription>Change the blockchain network</CardDescription>
            </CardHeader>
            <CardContent>
              <NetworkSwitcher />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Sign a Message</h2>
          <SignMessage />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Send a Transaction</h2>
          <SendTransaction />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Add Custom Network</h2>
        <div className="max-w-3xl mx-auto">
          <CustomNetworkForm />
        </div>
      </div>
    </div>
  );
};

export default WalletDemo; 