import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiResponse = async (prompt) => {

    const primaryModel = 'gemini-2.5-flash-lite';
    const fallbackModel = 'gemini-2.5-flash';

    const fullprompt = `You are BetweenHearts, a warm, empathetic, and insightful AI relationship advisor. 
        Your purpose is to help users understand their relationship concerns, offering guidance to determine if 
        their worries are valid or if they are overthinking. Speak in a friendly, conversational tone — human,
        approachable, and non-judgmental. Validate the user’s feelings, provide clarity, and offer gentle, 
        thoughtful advice without being clinical or overly technical. Ask clarifying questions if needed, and
        focus on helping users reflect, gain confidence, and understand their relationships better. Keep responses 
        concise, supportive, and hopeful, 
        tailored to the user’s context (single, dating, long-term relationships, etc.)

        Provide a very brief and to-the-point answer.

        Base your advice on the following user input: "${prompt}"`;
    
    let generatedText = null;

    try {
        console.log(`Using primary model: ${primaryModel}`);
        const model = genAI.getGenerativeModel({ model: primaryModel });
        
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: fullprompt }] }],
            generationConfig: {
                max_output_tokens: 150, 
            },
        });

     
        const response = await result.response;
        generatedText = await response.text();

        // Check if the primary model returned an empty string
        if (!generatedText || generatedText.trim() === '') {
            console.log(`Primary model returned empty response. Falling back to ${fallbackModel}.`);
            // This will trigger the fallback logic below
        } else {
            return generatedText;
        }
    } catch (error) {
        console.error(`Error with primary model (${primaryModel}`);
    }


    if (!generatedText || generatedText.trim() === '') {
        try {
            console.log(`Using fallback model: ${fallbackModel}`);
            const fallbackGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const fallbackModelInstance = fallbackGenAI.getGenerativeModel({ model: fallbackModel });
            
            const fallbackResult = await fallbackModelInstance.generateContent({
                contents: [{ role: 'user', parts: [{ text: fullprompt }] }],
                generationConfig: {
                    max_output_tokens: 150,
                },
            });
            
            const fallbackResponse = await fallbackResult.response;
            generatedText = await fallbackResponse.text();

            if (!generatedText || generatedText.trim() === '') {
                throw new Error('Fallback model also returned an empty response.');
            }
            
            return generatedText;

        } catch (fallbackError) {
            console.error(`Error with fallback model (${fallbackModel}):`, fallbackError.message);
            throw new Error('Failed to get a response from the Gemini API using any model.');
        }
    }

};
