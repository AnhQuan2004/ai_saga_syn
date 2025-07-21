import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Bounty {
  id: number;
  amount: string;
  distributed: string;
  creator: string;
  contributors: string[];
}

interface BountiesSummary {
  active: number;
  distributed: number;
  totalValue: string;
}

export const Bounties = () => {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [summary, setSummary] = useState<BountiesSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bounties/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch bounties");
        }
        const data = await response.json();
        if (data.success) {
          setBounties(data.bounties);
          setSummary(data.summary);
        } else {
          throw new Error(data.message || "Failed to fetch bounties");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Research Bounties</h1>
          <p className="text-muted-foreground">
            Contribute to research and earn rewards.
          </p>
        </div>
        {summary && (
          <Card className="w-full md:w-auto">
            <CardContent className="flex gap-4 p-4 text-sm">
              <div><strong>Active:</strong> {summary.active}</div>
              <div><strong>Distributed:</strong> {summary.distributed}</div>
              <div><strong>Total Value:</strong> {summary.totalValue}</div>
            </CardContent>
          </Card>
        )}
      </div>

      {loading && <p>Loading bounties...</p>}
      
      {error && (
         <Alert variant="destructive">
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bounties.map((bounty) => (
            <Card key={bounty.id} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Bounty #{bounty.id}</CardTitle>
                  <Badge variant={bounty.distributed  ? 'secondary' : 'default'}>
                    {bounty.distributed ? 'Distributed' : 'Active'}
                  </Badge>
                  
                </div>
                <CardDescription>Reward: {bounty.amount} QSG</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="truncate" title={bounty.creator}>
                    Creator: {bounty.creator}
                  </p>
                  <p>Contributors: {bounty.contributors.length}</p>
                </div>
             
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};