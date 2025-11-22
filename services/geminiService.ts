import { GoogleGenAI } from "@google/genai";
import { AIAssistanceType, Task } from "../types";

const getSystemInstruction = (type: AIAssistanceType): string => {
  switch (type) {
    case 'EXPAND_NOTES':
      return "You are a productivity expert. Elaborate on the user's task notes. Add relevant details, questions to consider, or potential risks. Keep it concise but helpful.";
    case 'SUGGEST_SUBTASKS':
      return "You are a project manager. Break down the task into 3-5 actionable subtasks. Return them as a markdown list.";
    case 'IMPROVE_CLARITY':
      return "You are a professional editor. Rewrite the task title and description to be more clear, action-oriented, and professional.";
    default:
      return "You are a helpful assistant.";
  }
};

export const assistWithTask = async (task: Task, type: AIAssistanceType): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Task Title: ${task.title}
      Current Notes: ${task.description}
      
      Please perform the requested action based on this context.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(type),
        temperature: 0.7,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key.";
  }
};
