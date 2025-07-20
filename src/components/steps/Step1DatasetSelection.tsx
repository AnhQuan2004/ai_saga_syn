import { useState, useEffect } from "react";
import { Search, Database, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatasetRow {
  id: number;
  text: string;
  label: number;
}

export const Step1DatasetSelection = ({ onNext }: { onNext: () => void }) => {
  const [searchValue, setSearchValue] = useState("galileo-ai/medical_transcription_40");
  const [selectedDataset, setSelectedDataset] = useState("galileo-ai/medical_transcription_40");
  const [sampleRows, setSampleRows] = useState<DatasetRow[]>([]);

  const fetchDatasetSample = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/fetch-dataset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sample_size: 5 }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Ensure we only show 5 samples, even if the API returns more
      setSampleRows(data.samples.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dataset sample:", error);
    }
  };

  useEffect(() => {
    if (selectedDataset) {
      fetchDatasetSample();
    }
  }, [selectedDataset]);

  const suggestedDatasets = [
    "galileo-ai/medical_transcription_40",
    "medical-notes/clinical-encounters",
    "healthcare-ai/patient-records"
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            1. Select Your Dataset
          </CardTitle>
          <CardDescription>
            Choose a Hugging Face dataset to use as the foundation for your synthetic data generation.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dataset-search">Dataset Repository</Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="dataset-search"
                placeholder="Search Hugging Face datasets..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedDatasets.map((dataset) => (
                <Button
                  key={dataset}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchValue(dataset);
                    setSelectedDataset(dataset);
                  }}
                  className="text-xs"
                >
                  {dataset}
                </Button>
              ))}
            </div>
          </div>

          {/* Dataset preview */}
          {selectedDataset && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Dataset Preview</h3>
              </div>
              
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing 5 sample rows from <span className="font-medium text-foreground">{selectedDataset}</span>
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">ID</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Text</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRows.map((row, index) => (
                        <tr key={row.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                          <td className="p-3 text-sm font-mono">{row.id}</td>
                          <td className="p-3 text-sm max-w-md">
                            <div className="truncate" title={row.text}>
                              {row.text}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                              {row.label}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext} className="bg-gradient-to-r from-primary to-primary-glow">
          Next: Configure Parameters
        </Button>
      </div>
    </div>
  );
};