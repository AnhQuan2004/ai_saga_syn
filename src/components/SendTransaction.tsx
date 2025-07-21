import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

export const SendTransaction: React.FC = () => {
  const { signer, isConnected } = useWallet();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!signer || !recipient || !amount) return;

    try {
      setIsLoading(true);
      setError(null);
      setTxHash('');

      // Basic address validation
      if (!ethers.utils.isAddress(recipient)) {
        throw new Error('Invalid Ethereum address');
      }

      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(amount);
      
      // Send transaction
      const tx = await signer.sendTransaction({
        to: recipient,
        value: amountInWei
      });

      setTxHash(tx.hash);
      
      // Wait for transaction to be mined
      await tx.wait();
      
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send transaction');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Send Transaction</CardTitle>
          <CardDescription>Connect your wallet to send transactions</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Transaction</CardTitle>
        <CardDescription>Send ETH to another address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="recipient" className="text-sm font-medium">Recipient Address</label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">Amount (ETH)</label>
          <Input
            id="amount"
            type="number"
            step="0.0001"
            min="0"
            placeholder="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {txHash && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Hash</label>
            <div className="p-3 bg-muted rounded-md break-all font-mono text-xs">
              {txHash}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSend}
          disabled={!recipient || !amount || isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Transaction'}
        </Button>
      </CardFooter>
    </Card>
  );
}; 