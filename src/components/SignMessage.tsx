import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

export const SignMessage: React.FC = () => {
  const { signer, isConnected } = useWallet();
  const [message, setMessage] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSign = async () => {
    if (!signer || !message) return;

    try {
      setIsLoading(true);
      setError(null);
      const signature = await signer.signMessage(message);
      setSignature(signature);
    } catch (err) {
      console.error('Error signing message:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign message');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign Message</CardTitle>
          <CardDescription>Connect your wallet to sign messages</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Message</CardTitle>
        <CardDescription>Sign a message with your Ethereum wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">Message</label>
          <Input
            id="message"
            placeholder="Enter a message to sign"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {signature && (
          <div className="space-y-2">
            <label htmlFor="signature" className="text-sm font-medium">Signature</label>
            <Textarea
              id="signature"
              readOnly
              value={signature}
              className="h-24 font-mono text-xs"
            />
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
          onClick={handleSign}
          disabled={!message || isLoading}
          className="w-full"
        >
          {isLoading ? 'Signing...' : 'Sign Message'}
        </Button>
      </CardFooter>
    </Card>
  );
}; 