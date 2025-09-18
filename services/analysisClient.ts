// src/services/analysisClient.ts
import { AnalysisReq } from "@/models";
import { Api } from "./http";

export async function runQuantitative(req: AnalysisReq) {
  // valida pelo zod no http.ts
  const resp = await Api.analyze(req);
  // opcional: validar resposta com zod também (crie schema)
  return resp;
}
