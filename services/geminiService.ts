
import { GoogleGenAI } from "@google/genai";
import { OrderData } from "../types";

export const getOrderAssistance = async (query: string, orderData: OrderData): Promise<string> => {
  // Always use the specified initialization format for GoogleGenAI with the API key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `You are a professional luxury brand checkout assistant. 
    The customer is currently at the checkout page. 
    Order Details: 
    - Order Number: ${orderData.orderNumber}
    - Total: ${orderData.currency} ${orderData.totalAmount}
    - Items: ${orderData.items.map(i => `${i.name} (Qty: ${i.quantity})`).join(', ')}
    
    Be helpful, concise, and professional. Answer questions about the order or common payment concerns.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    // Directly access the .text property from GenerateContentResponse
    return response.text || "I'm sorry, I couldn't process that request right now. How else can I help you with your order?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our smart assistant is currently busy. Please proceed with your payment or contact support.";
  }
};
