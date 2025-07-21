import React, { useState } from 'react';
import { WalletConnectCompact } from './WalletConnectCompact';
import { NetworkSwitcher } from './NetworkSwitcher';
import { SignMessage } from './SignMessage';
import { MintMetadataNFT } from './MintMetadataNFT';
import { useWallet } from '../contexts/WalletContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';

export interface WalletPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletPopup: React.FC<WalletPopupProps> = ({ isOpen, onClose }) => {
  const { isConnected, address, disconnectWallet, balance } = useWallet();
  const [activeTab, setActiveTab] = useState<string>('connect');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Wallet Connection</DialogTitle>
          </div>
          <DialogDescription>
            {isConnected 
              ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
              : 'Connect your wallet to continue'}
          </DialogDescription>
          <DialogDescription>
            Balance:
            <span className='font-[600] text-primary'>{isConnected 
              ? ` ${balance} SQA`
              : ''}</span>
          </DialogDescription>
        </DialogHeader>

        {!isConnected ? (
          <div className="py-4">
            <WalletConnectCompact />
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connect">Wallet</TabsTrigger>
                {/* <TabsTrigger value="sign">Sign</TabsTrigger> */}
                {/* <TabsTrigger value="mint">Mint NFT</TabsTrigger> */}
              </TabsList>
              
              <TabsContent value="connect" className="mt-4 space-y-4">
                <Button onClick={disconnectWallet} className="w-full">Disconnect</Button>
                <NetworkSwitcher />
              </TabsContent>
              
              <TabsContent value="sign" className="mt-4">
                <SignMessage />
              </TabsContent>
              
              <TabsContent value="mint" className="mt-4">
                <MintMetadataNFT />
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}; 