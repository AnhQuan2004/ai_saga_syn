import { useState } from "react";
import { FileText, DollarSign, Eye, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Dispatch, SetStateAction } from "react";

export const Step4FinalizeDetails = ({
  onNext,
  onBack,
  setSampleSize,
  sampleSize,
  datasetName,
  setDatasetName,
  description,
  setDescription,
  visibility,
  setVisibility,
  price,
  setPrice,
}: {
  onNext: () => void;
  onBack: () => void;
  setSampleSize: Dispatch<SetStateAction<number>>;
  sampleSize: number;
  datasetName: string;
  setDatasetName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  visibility: string;
  setVisibility: Dispatch<SetStateAction<string>>;
  price: string;
  setPrice: Dispatch<SetStateAction<string>>;
}) => {
  const isFormValid =
    datasetName.trim() &&
    description.trim() &&
    visibility &&
    price &&
    sampleSize > 0;

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            4. Finalize Dataset Details
          </CardTitle>
          <CardDescription>
            Configure the final details for your synthetic dataset before generation.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Dataset Name */}
          <div className="space-y-2">
            <Label htmlFor="dataset-name">Dataset Name</Label>
            <Input
              id="dataset-name"
              placeholder="e.g., Medical Transcription Synthetic Dataset v2"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your dataset, its purpose, and potential use cases..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public-sellable">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Public Sellable
                  </div>
                </SelectItem>
                <SelectItem value="public-free">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Public Free
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Private
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price (only if sellable) */}
          {visibility === "public-sellable" && (
            <div className="space-y-2">
              <Label htmlFor="price">Price in USDC</Label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  placeholder="5"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Number of Rows */}
          <div className="space-y-2">
            <Label htmlFor="sample-size">Number of Rows to Generate</Label>
            <Input
              id="sample-size"
              type="number"
              placeholder="e.g., 1000"
              value={sampleSize}
              onChange={(e) => setSampleSize(Number(e.target.value))}
            />
          </div>

          {/* Summary Card */}
          <Card className="bg-accent/50">
            <CardHeader>
              <CardTitle className="text-lg">Generation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Source Dataset:</span>
                  <p className="font-medium">galileo-ai/medical_transcription_40</p>
                </div>
                <div>
                  <span className="text-muted-foreground">AI Model:</span>
                  <p className="font-medium">Gemini 2.0 Flash</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Max Tokens:</span>
                  <p className="font-medium">3,000</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Output Format:</span>
                  <p className="font-medium">Structured JSON</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isFormValid}
          className="bg-gradient-to-r from-primary to-primary-glow flex items-center gap-2"
        >
          <Rocket className="w-4 h-4" />
          Generate Full Dataset
        </Button>
      </div>
    </div>
  );
};