import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export const DistributeBounty = () => {
  const [bountyId, setBountyId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bounty/${bountyId}/distribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Bounty Distributed Successfully",
          description: `Bounty #${result.bounty.id} has been distributed to ${result.bounty.contributorCount} contributor(s).`,
        });
        // Reset form
        setBountyId('');
      } else {
        throw new Error(result.message || 'Failed to distribute bounty');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Distributing Bounty",
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
          <CardTitle>Distribute Bounty</CardTitle>
          <CardDescription>Enter the Bounty ID to distribute the rewards to all contributors.</CardDescription>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Distributing...' : 'Distribute Bounty'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};