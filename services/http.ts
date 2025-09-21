import type { CharacterizeRequest, CharacterizeResponse, QuantAnalyzeRequest, QuantAnalyzeResponse } from '@/types/api';

const DEFAULT_TIMEOUT_MS = 20000;

export class HttpError extends Error {
constructor(public status: number, public body: any) { super(`HTTP ${status}`); }
}


function withTimeout<T>(p: Promise<T>, ms = DEFAULT_TIMEOUT_MS): Promise<T> {
return new Promise((resolve, reject) => {
const t = setTimeout(() => reject(new Error('timeout')), ms);
p.then(v => { clearTimeout(t); resolve(v); }).catch(e => { clearTimeout(t); reject(e); });
});
}


export class ApiClient {
constructor(private baseUrl: string) {}


private async request<T>(path: string, init?: RequestInit): Promise<T> {
const res = await withTimeout(fetch(`${this.baseUrl}${path}`, {
...(init ?? {}),
headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }
}));
if (!(res as Response).ok) {
const body = await (res as Response).text().catch(() => '');
let json: any; try { json = JSON.parse(body); } catch { json = body; }
throw new HttpError((res as Response).status, json);
}
return (res as Response).json() as Promise<T>;
}


analyzeQuant(payload: QuantAnalyzeRequest): Promise<QuantAnalyzeResponse> {
return this.request('/analyze', { method: 'POST', body: JSON.stringify(payload) });
}


characterizeInstrument(payload: CharacterizeRequest): Promise<CharacterizeResponse> {
return this.request('/instrument/characterize', { method: 'POST', body: JSON.stringify(payload) });
}


health(): Promise<{ status: 'ok' }> {
return this.request('/health');
}
}