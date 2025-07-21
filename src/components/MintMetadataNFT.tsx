import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { mintMetadataNFT, QSAGA_NETWORK, CONTRACT_ADDRESS } from '../utils/contractUtils';
import contractABI from '../abi.json';

export const MintMetadataNFT: React.FC = () => {
  const { signer, isConnected, isCorrectNetwork } = useWallet();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [transactionStep, setTransactionStep] = useState<string>('idle');
  
  // Form state
  const [formData, setFormData] = useState({
    sourceUrl: 'sd',
    contentHash: '0x514ce63a77d8b54ae6b818cb38fc45df56448dc40603e809a5f8709f15070c73',
    contentLink: '0x514ce63a77d8b54ae6b818cb38fc45df56448dc40603e809a5f8709f15070c73',
    embedVectorId: '0x514ce63a77d8b54ae6b818cb38fc45df56448dc40603e809a5f8709f15070c73',
    createdAt: Math.floor(Date.now() / 1000).toString(),
    tags: ['0x514ce63a77d8b54ae6b818cb38fc45df56448dc40603e809a5f8709f15070c73'],
    tokenURI: '0x514ce63a77d8b54ae6b818cb38fc45df56448dc40603e809a5f8709f15070c73'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const handleMintNFT = async () => {
    if (!signer) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setTxHash(null);
      setTokenId(null);
      setTransactionStep('preparing');

      // Validate form data
      if (!formData.sourceUrl) {
        throw new Error('Source URL is required');
      }
      if (!formData.contentHash) {
        throw new Error('Content hash is required');
      }
      if (!formData.contentLink) {
        throw new Error('Content link is required');
      }

      // Call the mintMetadataNFT utility function
      setTransactionStep('sending');
      const result = await mintMetadataNFT(signer, formData);
      
      setTxHash(result.txHash);
      setTransactionStep('confirming');
      
      if (result.tokenId) {
        setTokenId(result.tokenId);
        setTransactionStep('completed');
      } else {
        console.log('Transaction successful but no token ID found');
        setTransactionStep('completed-no-id');
      }
      
    } catch (err: any) {
      console.error('Error minting NFT:', err);
      setTransactionStep('error');
      
      // Handle specific error cases
      if (typeof err === 'object') {
        // Handle viem errors
        if (err.message?.includes('chain')) {
          setError('Chain error: Please ensure you are connected to the QSaga network');
        } else if (err.message?.includes('user rejected')) {
          setError('Transaction was rejected by the user');
        } else if (err.code === -32603) {
          setError('Internal JSON-RPC error. Please try again or check your wallet configuration.');
        } else if (err.data?.originalError?.message) {
          setError(err.data.originalError.message);
        } else {
          setError(err.message || 'Failed to mint NFT');
        }
      } else {
        setError('Unknown error occurred while minting NFT');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getExplorerUrl = (txHash: string) => {
    if (!QSAGA_NETWORK.blockExplorerUrls || QSAGA_NETWORK.blockExplorerUrls.length === 0) {
      return null;
    }
    return `${QSAGA_NETWORK.blockExplorerUrls[0]}/tx/${txHash}`;
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mint Metadata NFT</CardTitle>
          <CardDescription>Connect your wallet to mint an NFT</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wrong Network</CardTitle>
          <CardDescription>Please connect to the QSaga network to mint NFTs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="font-medium text-amber-700">Network Configuration</p>
            <ul className="text-sm text-amber-600 mt-2 space-y-1">
              <li>Network Name: {QSAGA_NETWORK.chainName}</li>
              <li>Chain ID: {QSAGA_NETWORK.chainId}</li>
              <li>Currency Symbol: {QSAGA_NETWORK.nativeCurrency.symbol}</li>
              <li>RPC URL: {QSAGA_NETWORK.rpcUrls[0]}</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Refresh Page
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint Metadata NFT</CardTitle>
        <CardDescription>Fill in the metadata details to mint your NFT</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="sourceUrl" className="text-sm font-medium">Source URL</label>
          <Input
            id="sourceUrl"
            name="sourceUrl"
            placeholder="https://example.com"
            value={formData.sourceUrl}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contentHash" className="text-sm font-medium">Content Hash (bytes32)</label>
          <Input
            id="contentHash"
            name="contentHash"
            placeholder="0x..."
            value={formData.contentHash}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="contentLink" className="text-sm font-medium">Content Link</label>
          <Input
            id="contentLink"
            name="contentLink"
            placeholder="https://ipfs.io/ipfs/..."
            value={formData.contentLink}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="embedVectorId" className="text-sm font-medium">Embed Vector ID</label>
          <Input
            id="embedVectorId"
            name="embedVectorId"
            placeholder="vector-id"
            value={formData.embedVectorId}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="createdAt" className="text-sm font-medium">Created At (Unix timestamp)</label>
          <Input
            id="createdAt"
            name="createdAt"
            type="number"
            value={formData.createdAt}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                placeholder={`Tag ${index + 1}`}
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                disabled={isLoading}
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => removeTag(index)}
                disabled={formData.tags.length === 1 || isLoading}
              >
                -
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addTag}
            disabled={isLoading}
          >
            Add Tag
          </Button>
        </div>

        <div className="space-y-2">
          <label htmlFor="tokenURI" className="text-sm font-medium">Token URI</label>
          <Input
            id="tokenURI"
            name="tokenURI"
            placeholder="https://ipfs.io/ipfs/..."
            value={formData.tokenURI}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        {txHash && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Transaction Hash</label>
              {getExplorerUrl(txHash) && (
                <a 
                  href={getExplorerUrl(txHash) || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  View in Explorer <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
            <div className="p-3 bg-muted rounded-md break-all font-mono text-xs">
              {txHash}
            </div>
          </div>
        )}

        {transactionStep === 'confirming' && !tokenId && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin text-blue-500" />
            <span className="text-sm text-blue-700">Confirming transaction...</span>
          </div>
        )}

        {tokenId && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="font-medium text-green-700">Successfully minted NFT!</p>
            <p className="text-sm text-green-600">Token ID: {tokenId}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center text-red-700">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {/* <Button
          onClick={handleMintNFT}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {transactionStep === 'preparing' && 'Preparing...'}
              {transactionStep === 'sending' && 'Sending...'}
              {transactionStep === 'confirming' && 'Confirming...'}
              {transactionStep === 'error' && 'Failed'}
              {!['preparing', 'sending', 'confirming', 'error'].includes(transactionStep) && 'Minting...'}
            </>
          ) : (
            'Mint NFT'
          )}
        </Button> */}
      </CardFooter>
    </Card>
  );
}; 