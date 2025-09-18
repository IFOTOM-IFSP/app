import { AnalysisReq, AnalysisReqSchema } from "@/models";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://SEU-RENDER.onrender.com/api/v1";

async function jfetch<T>(path: string, init: RequestInit, schema?: any): Promise<T> {
  const url = `${BASE_URL}${path}`;
  let lastErr: any;
  for (let i=0; i<3; i++) {
    try {
      const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init.headers||{}) }});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return schema ? schema.parse(data) : data;
    } catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, 200 * (i+1) + Math.random()*150));
    }
  }
  throw lastErr;
}

export const Api = {
  analyze: (body: AnalysisReq) =>
    jfetch("/analyze", { method: "POST", body: JSON.stringify(AnalysisReqSchema.parse(body)) }),
  processReferences: (body: any) =>
    jfetch("/process-references", { method: "POST", body: JSON.stringify(body) })
};
