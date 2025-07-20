import { Dispatch, SetStateAction, useState } from "react";
import {
  MessageSquare,
  Wand2,
  TestTube,
  Play,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface TestResult {
  id: string;
  input: string;
  output: string;
  status: "success" | "error";
}

interface ApiTestResult {
  original_text: string;
  synthetic_output: {
    synthetic_transcription: string;
    medical_specialty: string;
    explanation: string;
  };
}

export const Step3DefinePrompt = ({
  onNext,
  onBack,
  prompt,
  setPrompt,
}: {
  onNext: () => void;
  onBack: () => void;
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
}) => {
  const [activeTab, setActiveTab] = useState("wizard");
  const [isTestingRows, setIsTestingRows] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);

  const suggestedPrompts = [
    "Classify the medical transcription into appropriate medical specialties and provide reasoning",
    "Analyze the medical text and extract key clinical information with explanations",
    "Categorize the patient case and identify primary medical concerns with detailed rationale",
  ];

  const handleTestGeneration = async () => {
    setIsTestingRows(true);
    setTestProgress(0);
    setTestResults([]);
    setTestCompleted(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/test-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_text: prompt,
            domain: "medical",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const data = await response.json();

      const results = data.data.map((item: ApiTestResult, index: number) => ({
        id: `${index + 1}`,
        input: item.original_text,
        output: JSON.stringify(item.synthetic_output, null, 2),
        status: "success" as "success" | "error",
      }));

      setTestResults(results);
      setTestCompleted(true);
    } catch (error) {
      console.error("Test generation failed:", error);
    } finally {
      setIsTestingRows(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            3. Define and Test Your Prompt
          </CardTitle>
          <CardDescription>
            Create the prompt that will guide the AI in generating your
            synthetic dataset.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wizard" className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Wizard
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wizard" className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium">Suggested Prompts</h3>
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left h-auto p-4 justify-start"
                    onClick={() => {
                      setPrompt(prompt + ": {input}");
                      setActiveTab("manual");
                    }}
                  >
                    <div>
                      <p className="text-sm">{prompt}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Prompt</label>
                <Textarea
                  placeholder="Enter your custom prompt here. Use {input} as a placeholder for the dataset text."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Use <code className="bg-muted px-1 rounded">{"{input}"}</code>{" "}
                  to reference the input text from your dataset.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Test Generation Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-primary" />
            Test Your Prompt
          </CardTitle>
          <CardDescription>
            Generate a few sample outputs to verify your prompt works correctly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={handleTestGeneration}
            disabled={isTestingRows || !prompt.trim()}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Test Generation With 3 Rows
          </Button>

          {isTestingRows && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Generating test samples...</span>
              </div>
              <Progress value={testProgress} className="w-full" />
            </div>
          )}

          {testCompleted && testResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">
                  Test generation completed successfully!
                </span>
              </div>

              <div className="space-y-3">
                {testResults.map((result) => (
                  <div
                    key={result.id}
                    className="border border-border rounded-lg p-4 space-y-3"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Input:
                      </h4>
                      <p className="text-sm bg-muted/50 p-2 rounded">
                        {result.input}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Output:
                      </h4>
                      <pre className="text-xs bg-muted/50 p-2 rounded overflow-x-auto">
                        {result.output}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!testCompleted}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          Next: Finalize Details
        </Button>
      </div>
    </div>
  );
};
