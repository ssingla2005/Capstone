
import { GoogleGenAI } from "@google/genai";
import { DetectionState } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const model = 'gemini-2.5-flash';

/**
 * Analyzes an image frame with Gemini to detect eye and mouth state.
 * @param {string} imageBase64 - The base64 encoded image frame.
 * @returns {Promise<DetectionState>} The detected state.
 */
export const analyzeFrame = async (imageBase64: string): Promise<DetectionState> => {
    const prompt = `Analyze the person's face in this image. Focus on their eyes and mouth. Classify their state into one of the following exact categories: OPEN, CLOSED, YAWN. Respond with only one of these words. If no person is detected or the state cannot be determined, respond with UNKNOWN.`;

    try {
        const imagePart = {
            inlineData: {
                data: imageBase64.split(',')[1],
                mimeType: "image/jpeg",
            },
        };

        const response = await ai.models.generateContent({
            model,
            contents: { parts: [{ text: prompt }, imagePart] },
        });

        const text = response.text.trim().toUpperCase();

        if (Object.values(DetectionState).includes(text as DetectionState)) {
            return text as DetectionState;
        }

        console.warn(`Unexpected Gemini response: ${text}`);
        return DetectionState.UNKNOWN;

    } catch (error) {
        console.error("Error analyzing frame with Gemini:", error);
        return DetectionState.UNKNOWN;
    }
};
