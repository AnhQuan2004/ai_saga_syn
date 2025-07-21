import React, { useState } from 'react';
import { useWallet, NetworkConfig } from '../contexts/WalletContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AlertCircle } from 'lucide-react';

export const CustomNetworkForm: React.FC = () => {
  const { addNetwork, isConnected } = useWallet();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<NetworkConfig>({
    chainId: '',
    chainName: '',
    nativeCurrency: {
      name: '',
      symbol: '',
      decimals: 18,
    },
    rpcUrls: [''],
    blockExplorerUrls: [''],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'rpcUrl') {
      setFormData(prev => ({
        ...prev,
        rpcUrls: [value],
      }));
    } else if (name === 'blockExplorerUrl') {
      setFormData(prev => ({
        ...prev,
        blockExplorerUrls: [value],
      }));
    } else if (name === 'currencyName') {
      setFormData(prev => ({
        ...prev,
        nativeCurrency: {
          ...prev.nativeCurrency,
          name: value,
        },
      }));
    } else if (name === 'currencySymbol') {
      setFormData(prev => ({
        ...prev,
        nativeCurrency: {
          ...prev.nativeCurrency,
          symbol: value,
        },
      }));
    } else if (name === 'currencyDecimals') {
      setFormData(prev => ({
        ...prev,
        nativeCurrency: {
          ...prev.nativeCurrency,
          decimals: parseInt(value) || 18,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.chainId || !formData.chainId.startsWith('0x')) {
      setError('Chain ID must be a hex string starting with 0x');
      return false;
    }
    
    if (!formData.chainName) {
      setError('Network name is required');
      return false;
    }
    
    if (!formData.nativeCurrency.name || !formData.nativeCurrency.symbol) {
      setError('Currency name and symbol are required');
      return false;
    }
    
    if (!formData.rpcUrls[0]) {
      setError('RPC URL is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsAdding(true);
      setError(null);
      await addNetwork(formData);
      
      // Reset form
      setFormData({
        chainId: '',
        chainName: '',
        nativeCurrency: {
          name: '',
          symbol: '',
          decimals: 18,
        },
        rpcUrls: [''],
        blockExplorerUrls: [''],
      });
      
    } catch (err) {
      console.error('Error adding network:', err);
      setError(err instanceof Error ? err.message : 'Failed to add network');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Custom Network</CardTitle>
        <CardDescription>Configure a custom EVM-compatible network</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="chainId" className="text-sm font-medium">Chain ID (hex)</label>
            <Input
              id="chainId"
              name="chainId"
              placeholder="0x1"
              value={formData.chainId}
              onChange={handleChange}
              disabled={!isConnected || isAdding}
            />
            <p className="text-xs text-muted-foreground">Must be a hexadecimal number starting with 0x</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="chainName" className="text-sm font-medium">Network Name</label>
            <Input
              id="chainName"
              name="chainName"
              placeholder="My Custom Network"
              value={formData.chainName}
              onChange={handleChange}
              disabled={!isConnected || isAdding}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="rpcUrl" className="text-sm font-medium">RPC URL</label>
            <Input
              id="rpcUrl"
              name="rpcUrl"
              placeholder="https://..."
              value={formData.rpcUrls[0]}
              onChange={handleChange}
              disabled={!isConnected || isAdding}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="blockExplorerUrl" className="text-sm font-medium">Block Explorer URL (optional)</label>
            <Input
              id="blockExplorerUrl"
              name="blockExplorerUrl"
              placeholder="https://..."
              value={formData.blockExplorerUrls[0]}
              onChange={handleChange}
              disabled={!isConnected || isAdding}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="currencyName" className="text-sm font-medium">Currency Name</label>
              <Input
                id="currencyName"
                name="currencyName"
                placeholder="Ether"
                value={formData.nativeCurrency.name}
                onChange={handleChange}
                disabled={!isConnected || isAdding}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="currencySymbol" className="text-sm font-medium">Currency Symbol</label>
              <Input
                id="currencySymbol"
                name="currencySymbol"
                placeholder="ETH"
                value={formData.nativeCurrency.symbol}
                onChange={handleChange}
                disabled={!isConnected || isAdding}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="currencyDecimals" className="text-sm font-medium">Decimals</label>
              <Input
                id="currencyDecimals"
                name="currencyDecimals"
                type="number"
                placeholder="18"
                value={formData.nativeCurrency.decimals}
                onChange={handleChange}
                disabled={!isConnected || isAdding}
              />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={!isConnected || isAdding}
          className="w-full"
        >
          {isAdding ? 'Adding Network...' : 'Add Network'}
        </Button>
      </CardFooter>
    </Card>
  );
}; 