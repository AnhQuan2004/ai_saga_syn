import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Button } from './ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { QSAGA_NETWORK } from '../utils/contractUtils';

export const NetworkSwitcher: React.FC = () => {
  const { switchNetwork, networkName, isConnected, isCorrectNetwork, error } = useWallet();
  const [isChanging, setIsChanging] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const handleSwitchToQSaga = async () => {
    if (!isConnected) return;
    
    try {
      setIsChanging(true);
      setNetworkError(null);
      await switchNetwork(QSAGA_NETWORK);
    } catch (err) {
      console.error('Network switch error:', err);
      setNetworkError(err instanceof Error ? err.message : 'Failed to switch network');
    } finally {
      setIsChanging(false);
    }
  };

  if (!isConnected) {
    return (
      <Button variant="outline" disabled className="w-full">
        Connect wallet to switch networks
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div>
          <div className="text-sm font-medium">Current Network</div>
          <div className="text-sm text-muted-foreground">{networkName}</div>
        </div>
        {!isCorrectNetwork && (
          <Button
            variant="outline"
            onClick={handleSwitchToQSaga}
            disabled={isChanging}
            className="ml-4"
          >
            {isChanging ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Switching...
              </>
            ) : (
              'Switch to QSaga'
            )}
          </Button>
        )}
        {isCorrectNetwork && (
          <div className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
            Connected
          </div>
        )}
      </div>

      {(networkError || error) && (
        <div className="flex items-center text-red-500 text-sm mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{networkError || error}</span>
        </div>
      )}

      <div className="p-3 border rounded-md bg-slate-50">
        <h3 className="text-sm font-medium mb-2">QSaga Network Details</h3>
        <ul className="text-xs space-y-1 text-slate-700">
          <li><span className="font-medium">Chain ID:</span> {QSAGA_NETWORK.chainId}</li>
          <li><span className="font-medium">RPC URL:</span> {QSAGA_NETWORK.rpcUrls[0]}</li>
          <li><span className="font-medium">Currency:</span> {QSAGA_NETWORK.nativeCurrency.symbol}</li>
          <li><span className="font-medium">Explorer:</span> {QSAGA_NETWORK.blockExplorerUrls[0]}</li>
        </ul>
      </div>
    </div>
  );
}; 