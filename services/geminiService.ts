
import { GoogleGenAI, Type } from "@google/genai";
import { Character, Message, PersonalityType } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = ai.models;

const characterProfileSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "A common first name." },
        age: { type: Type.INTEGER, description: "Age between 20 and 28." },
        occupation: { type: Type.STRING, description: "A modern, relatable occupation." },
        personality: { type: Type.STRING, description: "One of the specified personality types." },
        bio: { type: Type.STRING, description: "A short, engaging bio (2-3 sentences) written in the first person." },
        interests: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-4 specific interests or hobbies."
        },
    },
    required: ["name", "age", "occupation", "personality", "bio", "interests"],
};

export const generateCharacterProfile = async (): Promise<Character> => {
    const personalities: PersonalityType[] = ['Shy', 'Outgoing', 'Intellectual', 'Artistic', 'Sassy', 'Kind', 'Mysterious'];
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
    
    const prompt = `Generate a unique and interesting character profile for a dating simulation game. The character is a young woman. Her personality must be: ${randomPersonality}.`;

    const result = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: 'application/json',
            responseSchema: characterProfileSchema,
        }
    });
    
    const jsonString = result.text;
    const profileData = JSON.parse(jsonString);

    return {
        ...profileData,
        id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
        affinity: 50, // Starting affinity
    };
};

const npcResponseSchema = {
    type: Type.OBJECT,
    properties: {
        response: { type: Type.STRING, description: "The character's response text." },
        affinityChange: { type: Type.INTEGER, description: "A number from -5 to 5, indicating how the user's message affected the character's affinity." },
    },
    required: ["response", "affinityChange"],
};

export const getNPCResponse = async (conversationHistory: Message[], character: Character, userInput: string): Promise<{ response: string, affinityChange: number }> => {
    const historyText = conversationHistory.map(m => `${m.sender === 'user' ? 'You' : character.name}: ${m.text}`).join('\n');

    const systemInstruction = `You are playing the role of ${character.name}, a ${character.age}-year-old ${character.occupation}.
Your personality is: ${character.personality}.
Your interests are: ${character.interests.join(', ')}.
Your bio is: "${character.bio}"
Your current feeling (affinity) towards the user is ${character.affinity}/100.
Respond to the user's message naturally, based on your personality and the conversation so far. Keep your replies concise and realistic for a text chat. Your response will directly influence your affinity for the user.`;

    const prompt = `Here is the conversation history:\n${historyText}\n\nYou: ${userInput}\n\n${character.name}'s response (in JSON format):`;
    
    const result = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: npcResponseSchema,
        }
    });

    const jsonString = result.text;
    return JSON.parse(jsonString);
};

const dialogueOptionsSchema = {
    type: Type.OBJECT,
    properties: {
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of exactly 3 distinct dialogue options for the user."
        }
    },
    required: ["suggestions"],
};

export const getDialogueOptions = async (conversationHistory: Message[], character: Character): Promise<string[]> => {
    const historyText = conversationHistory.map(m => `${m.sender === 'user' ? 'You' : character.name}: ${m.text}`).join('\n');

    const systemInstruction = `You are a dating coach AI. Your client is talking to ${character.name}, whose personality is ${character.personality}. The goal is to increase her affinity.
Based on the conversation history, suggest three distinct and effective replies. The replies should vary in tone (e.g., one witty, one inquisitive, one caring).`;
    
    const prompt = `Conversation History:\n${historyText}\n\nGenerate three response suggestions for your client (in JSON format):`;

    const result = await model.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: dialogueOptionsSchema,
        }
    });

    const jsonString = result.text;
    const data = JSON.parse(jsonString);
    return data.suggestions;
};
