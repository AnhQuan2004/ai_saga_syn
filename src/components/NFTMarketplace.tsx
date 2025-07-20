import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NFTMetadata {
  tokenId: number;
  source_url: string;
  content_hash: string;
  content_link: string;
  embed_vector_id: string;
  created_at: number;
  tags: string[];
  owner: string;
  tokenURI: string;
  name: string;
  description: string;
}

export const NFTMarketplace = () => {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/metadata/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch metadata");
        }
        const data = await response.json();
        if (data.success) {
          const filteredNfts = data.metadata.filter(
            (nft: NFTMetadata) => nft.content_link !== "https://ipfs.io/ipfs/QmExample"
          );
          setNfts(filteredNfts);
        } else {
          throw new Error(data.message || "Failed to fetch metadata");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dataset</h1>
          <p className="text-muted-foreground">
            Browse and explore generated datasets
          </p>
        </div>
      </div>

      {loading && <p>Loading datasets...</p>}
      
      {error && (
         <Alert variant="destructive">
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <Card
              key={nft.tokenId}
              className="shadow-card hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2" title={nft.name}>
                  {nft.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{nft.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(nft.tags || []).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      Created:{" "}
                      {new Date(nft.created_at * 1000).toLocaleDateString()}
                    </p>
                    <p className="truncate" title={nft.owner}>
                      Owner: {nft.owner}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(nft.content_link, "_blank")}
                  className="w-full mt-4"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Dataset
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
