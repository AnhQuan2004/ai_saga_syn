import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SyntheticData {
  original_text: string;
  synthetic_output: {
    synthetic_transcription: string;
    medical_specialty: string;
    explanation: string;
  };
}

const DatasetDetail = () => {
  const location = useLocation();
  const { state } = location;
  const item = state?.item;

  if (!item) {
    return <div>Dataset not found.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>{item.metadata.dataset_name}</CardTitle>
          <CardDescription>{item.metadata.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div>
              <p className="font-semibold">Visibility</p>
              <p>{item.metadata.visibility}</p>
            </div>
            <div>
              <p className="font-semibold">Price</p>
              <p>${item.metadata.price_usdc.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Domain</p>
              <p>{item.metadata.domain}</p>
            </div>
            <div>
              <p className="font-semibold">Sample Size</p>
              <p>{item.metadata.sample_size}</p>
            </div>
            <div>
              <p className="font-semibold">AI Model</p>
              <p>{item.metadata.ai_model}</p>
            </div>
             <div>
              <p className="font-semibold">Source Dataset</p>
              <p>{item.metadata.source_dataset}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Generated Data</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Original Text</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Synthetic Transcription</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Medical Specialty</th>
                  </tr>
                </thead>
                <tbody>
                  {item.data.map((row: SyntheticData, index: number) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatasetDetail;