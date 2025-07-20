import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export const CreateBounty = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bounty/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          amount,
          tags: tags.split(',').map(tag => tag.trim()),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Bounty Created Successfully",
          description: `Bounty ID: ${result.bounty.id} | Tx: ${result.transaction.hash.slice(0,10)}...`
        });
        // Reset form
        setTitle('');
        setDescription('');
        setAmount('');
        setTags('');
      } else {
        throw new Error(result.message || 'Failed to create bounty');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Creating Bounty",
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
          <CardTitle>Create a New Bounty</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Bounty Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Analyze Medical Dataset for Cancer Research"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the bounty..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Reward Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 0.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., medical, research, ai"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Bounty'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};