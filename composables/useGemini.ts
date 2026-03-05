
// Fix: Updated initialization to use process.env.API_KEY directly to comply with Google GenAI SDK rules
import { GoogleGenAI } from "@google/genai";
import type { OrderData } from "../types";

export const useGemini = () => {
  const getOrderAssistance = async (query: string, orderData: OrderData): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `You are a professional luxury brand checkout assistant. 
      Order Number: ${orderData.orderNumber}
      Total: ${orderData.currency} ${orderData.totalAmount - orderData.discountAmount}
      Items: ${orderData.items.map(i => `${i.name} (Qty: ${i.quantity})`).join(', ')}
      Be helpful, concise, and professional.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      // Fixed: Directly access the .text property from GenerateContentResponse
      return response.text || "I'm sorry, I couldn't process that request right now.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Our smart assistant is currently busy. Please proceed with your payment.";
    }
  };

  return { getOrderAssistance };
};
