import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NFTMarketplace } from "@/components/NFTMarketplace";

interface Metadata {
  dataset_name: string;
  description: string;
  visibility: string;
  price_usdc: number;
  domain: string;
  sample_size: number;
  max_tokens: number;
  output_format: string;
  source_dataset: string;
  ai_model: string;
  created_at: string;
  filename: string;
}

interface SyntheticData {
  original_text: string;
  synthetic_output: {
    synthetic_transcription: string;
    medical_specialty: string;
    explanation: string;
  };
  verification_status: string;
  signature: string;
}

interface HistoryItem {
  metadata: Metadata;
  data: SyntheticData[];
}

const Marketplace = () => {
  return <NFTMarketplace />;
};

export default Marketplace;