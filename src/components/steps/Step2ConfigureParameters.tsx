import { useState } from "react";
import { Settings, Brain, Code, Plus, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SchemaProperty {
  id: string;
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export const Step2ConfigureParameters = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [model, setModel] = useState("gemini-2.0-flash");
  const [maxTokens, setMaxTokens] = useState("3000");
  const [inputFeature, setInputFeature] = useState("text");
  const [structuredOutput, setStructuredOutput] = useState(true);
  const [schemaProperties, setSchemaProperties] = useState<SchemaProperty[]>([
    {
      id: "1",
      name: "explanation",
      type: "string",
      description: "The explanation of the label",
      required: true
    },
    {
      id: "2", 
      name: "label",
      type: "string",
      description: "The classification label",
      required: true
    }
  ]);

  const addProperty = () => {
    const newProperty: SchemaProperty = {
      id: Date.now().toString(),
      name: "",
      type: "string",
      description: "",
      required: false
    };
    setSchemaProperties([...schemaProperties, newProperty]);
  };

  const removeProperty = (id: string) => {
    setSchemaProperties(schemaProperties.filter(prop => prop.id !== id));
  };

  const updateProperty = (id: string, field: keyof SchemaProperty, value: string | boolean) => {
    setSchemaProperties(schemaProperties.map(prop => 
      prop.id === id ? { ...prop, [field]: value } : prop
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            2. Configure Generation Parameters
          </CardTitle>
          <CardDescription>
            Set up the AI model and generation parameters for your synthetic dataset.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model-select">AI Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.0-flash">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Gemini 2.0 Flash
                  </div>
                </SelectItem>
                <SelectItem value="llama-3-70b">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Llama-3-70B
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <Label htmlFor="max-tokens">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
              placeholder="3000"
            />
          </div>

          {/* Input Feature */}
          <div className="space-y-2">
            <Label htmlFor="input-feature">Input Feature</Label>
            <Select value={inputFeature} onValueChange={setInputFeature}>
              <SelectTrigger>
                <SelectValue placeholder="Select input feature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">text</SelectItem>
                <SelectItem value="content">content</SelectItem>
                <SelectItem value="description">description</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Structured Output Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="structured-output">Structured Output</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Define a JSON schema for consistent output structure</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate data with a consistent JSON structure
              </p>
            </div>
            <Switch
              id="structured-output"
              checked={structuredOutput}
              onCheckedChange={setStructuredOutput}
            />
          </div>

          {/* JSON Schema Editor */}
          {structuredOutput && (
            <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" />
                  <h3 className="font-medium">JSON Schema Properties</h3>
                </div>
                <Button onClick={addProperty} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Property
                </Button>
              </div>

              <div className="space-y-3">
                {schemaProperties.map((property) => (
                  <div key={property.id} className="flex items-center gap-3 p-3 bg-background rounded-md border border-border">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <Input
                        placeholder="Property name"
                        value={property.name}
                        onChange={(e) => updateProperty(property.id, 'name', e.target.value)}
                      />
                      <Select 
                        value={property.type} 
                        onValueChange={(value) => updateProperty(property.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">string</SelectItem>
                          <SelectItem value="number">number</SelectItem>
                          <SelectItem value="boolean">boolean</SelectItem>
                          <SelectItem value="array">array</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Description"
                        value={property.description}
                        onChange={(e) => updateProperty(property.id, 'description', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={property.required}
                          onCheckedChange={(checked) => updateProperty(property.id, 'required', checked)}
                        />
                        <span className="text-xs text-muted-foreground">Required</span>
                      </div>
                      <Button
                        onClick={() => removeProperty(property.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
        <Button onClick={onNext} className="bg-gradient-to-r from-primary to-primary-glow">
          Next: Define Prompt
        </Button>
      </div>
    </div>
  );
};