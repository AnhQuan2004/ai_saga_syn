import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export const AddContributor = () => {
  const [bountyId, setBountyId] = useState('');
  const [contributorAddress, setContributorAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bounty/${bountyId}/add-contributor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contributorAddress }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Contributor Added Successfully",
          description: `Address ${result.bounty.newContributor.slice(0, 10)}... added to Bounty #${result.bounty.id}.`,
        });
        // Reset form
        setBountyId('');
        setContributorAddress('');
      } else {
        throw new Error(result.message || 'Failed to add contributor');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Adding Contributor",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add Contributor to Bounty</CardTitle>
          <CardDescription>Enter the Bounty ID and the contributor's wallet address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bountyId">Bounty ID</Label>
              <Input
                id="bountyId"
                value={bountyId}
                onChange={(e) => setBountyId(e.target.value)}
                placeholder="e.g., 5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contributorAddress">Contributor Address</Label>
              <Input
                id="contributorAddress"
                value={contributorAddress}
                onChange={(e) => setContributorAddress(e.target.value)}
                placeholder="0x1234..."
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Contributor'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};