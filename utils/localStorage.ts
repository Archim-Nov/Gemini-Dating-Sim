
import { Character, Message } from '../types';

const CHARACTERS_KEY = 'gemini-dating-sim-characters';
const CONVERSATIONS_KEY = 'gemini-dating-sim-conversations';

export const saveCharactersToStorage = (characters: Character[]): void => {
    try {
        localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
    } catch (error) {
        console.error("Error saving characters to local storage:", error);
    }
};

export const loadCharactersFromStorage = (): Character[] => {
    try {
        const storedCharacters = localStorage.getItem(CHARACTERS_KEY);
        return storedCharacters ? JSON.parse(storedCharacters) : [];
    } catch (error) {
        console.error("Error loading characters from local storage:", error);
        return [];
    }
};

export const saveConversationsToStorage = (conversations: Record<string, Message[]>): void => {
    try {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (error) {
        console.error("Error saving conversations to local storage:", error);
    }
};

export const loadConversationsFromStorage = (): Record<string, Message[]> => {
    try {
        const storedConversations = localStorage.getItem(CONVERSATIONS_KEY);
        return storedConversations ? JSON.parse(storedConversations) : {};
    } catch (error) {
        console.error("Error loading conversations from local storage:", error);
        return {};
    }
};
