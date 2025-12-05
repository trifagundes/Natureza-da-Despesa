
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

const getSystemInstruction = (contextData: string) => `
Você é um consultor especialista em Contabilidade Pública para Municípios do Rio Grande do Sul (TCE-RS).
Seu objetivo é ajudar o gestor a classificar corretamente a "Natureza de Despesa" (Elemento de Despesa) usando a base de dados oficial de 2025.

Use a base de conhecimento abaixo (Lista de Códigos) para responder.

REGRAS:
1. Analise o pedido do usuário (ex: "comprar café", "pagar luz", "consertar veículo").
2. Identifique o código (Natureza de Despesa) mais adequado da lista. Tente sempre encontrar o código ANALÍTICO (marcado como TIPO: Analítica) mais específico possível.
3. **IMPORTANTE: Se houver ambiguidade (ex: "material de informática" pode ser consumo ou permanente, dependendo do uso e durabilidade), NÃO chute. FAÇA PERGUNTAS ao usuário para esclarecer o propósito da despesa antes de dar a classificação final.**
4. Explique brevemente o porquê da escolha, citando a descrição oficial.
5. Se não encontrar uma correspondência exata, sugira a mais próxima ou avise que não consta na base simplificada.
6. Responda em Português do Brasil de forma profissional e direta.

BASE DE CONHECIMENTO ATUALIZADA (2025):
${contextData}
`;

export const sendMessageToGemini = async (message: string, history: { role: string, parts: { text: string }[] }[], contextData: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    
    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: getSystemInstruction(contextData),
            temperature: 0.3,
        },
        history: history
    });

    const response = await chat.sendMessage({ message: message });
    return response.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Ocorreu um erro ao consultar o assistente inteligente. Verifique sua conexão ou tente novamente.";
  }
};
