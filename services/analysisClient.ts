// src/services/analysisClient.ts
import { ENV } from "@/config/env";
import type { QuantAnalyzeRequest, QuantAnalyzeResponse } from "@/types/api";
import { ApiClient } from "./http";

const client = new ApiClient(ENV.API_BASE_URL);

export async function runQuantitative(req: QuantAnalyzeRequest): Promise<QuantAnalyzeResponse> {
  return client.analyzeQuant(req);
}
