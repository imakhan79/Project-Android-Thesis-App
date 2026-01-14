
import { GoogleGenAI, Type } from "@google/genai";
import { ComponentCategory } from "../types";

// Fixed: Strictly follow the Google GenAI SDK initialization guidelines.
// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeApkStatic = async (manifestText: string, layoutSummary: string) => {
  try {
    // Fixed: Upgraded model to gemini-3-pro-preview for complex reasoning task as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform static analysis on this Android APK Manifest and View Hierarchy summary. 
      Identify components and categorize them into: ${Object.values(ComponentCategory).join(', ')}.
      Assign a risk score (0-10) based on complexity and potential for breakage.
      
      Manifest:
      ${manifestText}
      
      Layouts:
      ${layoutSummary}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              typeCategory: { type: Type.STRING },
              selector: { type: Type.STRING },
              riskScore: { type: Type.NUMBER },
              reasoning: { type: Type.STRING }
            },
            required: ['typeCategory', 'selector', 'riskScore']
          }
        }
      }
    });

    // Fixed: Accessed text property directly and added a check for undefined/empty response
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Gemini static analysis failed:", error);
    return null;
  }
};

export const simulateRLEpisode = async (params: any) => {
  try {
    // Fixed: Upgraded model to gemini-3-pro-preview for complex reasoning task as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Simulate a Hybrid RL (Actor-Critic + DDQN) exploration episode for an Android app with these parameters: ${JSON.stringify(params)}.
      Generate a sequence of 5-10 actions. 
      Include rewards, novelty scores, and fault likelihood.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            episodeId: { type: Type.STRING },
            sequence: { 
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  stateHash: { type: Type.STRING },
                  reward: { type: Type.NUMBER }
                }
              }
            },
            totalReward: { type: Type.NUMBER },
            novelty: { type: Type.NUMBER },
            faultLikelihood: { type: Type.NUMBER },
            crashFlag: { type: Type.BOOLEAN }
          }
        }
      }
    });
    // Fixed: Accessed text property directly and added a check for undefined/empty response
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("Gemini RL simulation failed:", err);
    return null;
  }
}
