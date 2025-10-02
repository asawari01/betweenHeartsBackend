import { getGeminiResponse } from '../services/geminiService.js';

const generateContent = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required, '});
    }

    try {
        const textResponse = await getGeminiResponse(prompt);
        res.status(200).json( { text: textResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default generateContent;