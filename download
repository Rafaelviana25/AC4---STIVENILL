
import { GoogleGenAI } from "@google/genai";
import { AC4RateTable } from "../types";
import { DEFAULT_RATES } from "../constants";

// Function to fetch latest AC4 rates using Gemini with Search Grounding
export const fetchLatestRates = async (): Promise<{ rates: AC4RateTable; sources: string[] }> => {
  try {
    // Initializing AI client using environment variable
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Per guidelines, when using googleSearch, responseMimeType should not be set 
    // and response.text should not be parsed as JSON.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Qual o valor atual da hora do AC-4 (Indenização por Serviço Extraordinário) para Praças e Oficiais da PMGO em 2024 e 2025? Por favor, liste explicitamente os valores para Praca, Oficial e OficialSuperior.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extracting website URLs from grounding chunks is mandatory when using googleSearch
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web?.uri)
      .filter(Boolean) || [];

    try {
      // Using regex to safely extract values from text as per guidelines against JSON parsing grounded results
      const extractValue = (pattern: RegExp): number | null => {
        const match = text.match(pattern);
        if (match && match[1]) {
          return parseFloat(match[1].replace(',', '.'));
        }
        return null;
      };

      const rates: AC4RateTable = {
        Praca: extractValue(/Praça:?\s*R?\$\s*(\d+[.,]\d+)/i) || DEFAULT_RATES.Praca,
        Oficial: extractValue(/Oficial:?\s*R?\$\s*(\d+[.,]\d+)/i) || DEFAULT_RATES.Oficial,
        OficialSuperior: extractValue(/Oficial\s+Superior:?\s*R?\$\s*(\d+[.,]\d+)/i) || DEFAULT_RATES.OficialSuperior
      };
      
      return { rates, sources };
    } catch (e) {
      console.warn("Error processing AI text response, falling back to defaults", e);
      return { rates: DEFAULT_RATES, sources };
    }
  } catch (error) {
    console.error("AI Fetch Error:", error);
    return { rates: DEFAULT_RATES, sources: [] };
  }
};
