import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Download, Store, CheckCircle, AlertCircle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

type GenerationStatus = "idle" | "generating" | "success" | "error";

interface SyntheticData {
  original_text: string;
  synthetic_output: {
    synthetic_transcription: string;
    medical_specialty: string;
    explanation: string;
  };
}


export const Step5GenerateDataset = ({
  onBack,
  sampleSize,
  datasetName,
  description,
  visibility,
  price,
  maxTokens,
  model,
  prompt,
}: {
  onBack: () => void;
  sampleSize: number;
  datasetName: string;
  description: string;
  visibility: string;
  price: string;
  maxTokens: string;
  model: string;
  prompt: string;
}) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [generatedRows, setGeneratedRows] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [syntheticData, setSyntheticData] = useState<SyntheticData[]>([]);

  useEffect(() => {
    // Auto-start generation when component mounts
    startGeneration();
  }, []);

  const startGeneration = async () => {
    setStatus("generating");
    setProgress(0);
    setGeneratedRows(0);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/generate-and-mint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sample_size: sampleSize,
          domain: "medical",
          dataset_name: datasetName,
          description: description,
          visibility: visibility,
          price_usdc: parseFloat(price),
          max_tokens: parseInt(maxTokens),
          output_format: "Structured JSON",
          source_dataset: "galileo-ai/medical_transcription_40",
          ai_model: model,
          input_text: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const data = await response.json();

      if (data.success) {
        setDownloadUrl(data.irys_links.content_url);
        setSyntheticData(data.data);
        // Data for marketplace will be fetched on the marketplace page itself

        // Simulate progress for now, as the API is not streaming progress
        for (let i = 0; i <= 100; i += 2) {
          setProgress(i);
          setGeneratedRows(Math.floor((i / 100) * sampleSize));
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        setStatus("success");
      } else {
        throw new Error(data.message || "Generation failed");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      setStatus("error");
    }
  };

  const downloadDataset = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  const listOnMarketplace = () => {
    navigate("/marketplace");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            5. Generate Full Dataset
          </CardTitle>
          <CardDescription>
            Your synthetic medical dataset is being generated using AI.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {status === "generating" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <div>
                  <p className="font-medium">Generating synthetic dataset...</p>
                  <p className="text-sm text-muted-foreground">
                    {generatedRows} of {sampleSize} rows completed
                  </p>
                </div>
              </div>
              
              <Progress value={progress} className="w-full h-3" />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{Math.floor(progress)}%</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{generatedRows}</p>
                  <p className="text-xs text-muted-foreground">Rows Generated</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">~{Math.ceil((100 - progress) * 0.3)}m</p>
                  <p className="text-xs text-muted-foreground">Time Remaining</p>
                </div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Dataset generation completed successfully!</strong>
                </AlertDescription>
              </Alert>

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Original Text</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Synthetic Transcription</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Medical Specialty</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syntheticData.slice(0, 5).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                          <td className="p-3 text-sm max-w-md">
                            <div className="truncate" title={row.original_text}>
                              {row.original_text}
                            </div>
                          </td>
                          <td className="p-3 text-sm max-w-md">
                            <div className="truncate" title={row.synthetic_output.synthetic_transcription}>
                              {row.synthetic_output.synthetic_transcription}
                            </div>
                          </td>
                          <td className="p-3 text-sm">{row.synthetic_output.medical_specialty}</td>
                          <td className="p-3 text-sm max-w-md">
                            <div className="truncate" title={row.synthetic_output.explanation}>
                              {row.synthetic_output.explanation}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>


              <div className="space-y-3">
                <Button
                  onClick={downloadDataset}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow"
                  size="lg"
                  disabled={!downloadUrl}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Dataset
                </Button>
                
                <Button
                  onClick={listOnMarketplace}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={status !== 'success'}
                >
                  <Store className="w-4 h-4 mr-2" />
                  List on Marketplace
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Generation failed.</strong><br />
                Please check your configuration and try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {status !== "generating" && (
        <div className="flex justify-between">
          <Button onClick={onBack} variant="outline">
            Back
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Start New Generation
          </Button>
        </div>
      )}
    </div>
  );
};