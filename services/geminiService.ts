
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiCharData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchCharacterDetails(chars: string[]): Promise<GeminiCharData[]> {
  if (chars.length === 0) return [];
  
  const prompt = `Provide the Pinyin and English meaning for these Chinese characters: ${chars.join(', ')}. 
  Return a JSON array where each item has "char", "pinyin", and "meaning" (short description).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              char: { type: Type.STRING },
              pinyin: { type: Type.STRING },
              meaning: { type: Type.STRING },
            },
            required: ["char", "pinyin", "meaning"],
          },
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error fetching character details:", error);
    // Fallback if API fails
    return chars.map(c => ({ char: c, pinyin: '...', meaning: '...' }));
  }
}
