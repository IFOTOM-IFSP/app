import {
  AnalysisRequest,
  AnalysisResponse,
  ReferenceProcessingRequest,
  ReferenceProcessingResponse
} from '@/schema/apiSchema';




const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export async function processReferences(payload: ReferenceProcessingRequest): Promise<ReferenceProcessingResponse> {
  const url = `${apiUrl}/process-references`;
  console.log(`[apiService] A enviar dados de referência para: ${url}`);
  const controller = new AbortController();
  // const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal ,
      body: JSON.stringify(payload),
    });
    // clearTimeout(timeoutId);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[apiService] Erro do servidor (${response.status}) ao processar referências: ${errorText}`);
      throw new Error(`Erro no processamento das referências. Status: ${response.status}`);
    }
    return await response.json();

  } catch (error) {
    // clearTimeout(timeoutId); 
    if ((error as Error).name === 'AbortError') {
      console.error("[apiService] A requisição excedeu o tempo limite.");
      throw new Error("O servidor demorou muito para responder. Tente novamente.");
    }
    console.error("[apiService] Erro de rede detalhado ao processar referências:", error);

    throw error;
  }
}

export async function runAnalysis(payload: AnalysisRequest): Promise<AnalysisResponse> {
  const url = `${apiUrl}/analyze`;
  console.log(`[apiService] A enviar dados da amostra para análise em: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[apiService] Erro do servidor (${response.status}) ao analisar amostra: ${errorText}`);
      throw new Error(`Erro ao calcular o resultado final. Status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("[apiService] Erro de rede detalhado ao analisar amostra:", error);
    throw error;
  }
}
