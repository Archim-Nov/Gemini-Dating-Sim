
import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { Character, Message } from '../types';
import CharacterProfile from './CharacterProfile';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import * as geminiService from '../services/geminiService';

interface ChatWindowProps {
    character: Character;
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
    updateCharacterAffinity: (charId: string, change: number) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ character, messages, setMessages, updateCharacterAffinity }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: `user_${Date.now()}`,
            text,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            const { response, affinityChange } = await geminiService.getNPCResponse(updatedMessages, character, text);
            updateCharacterAffinity(character.id, affinityChange);
            
            const npcMessage: Message = {
                id: `npc_${Date.now()}`,
                text: response,
                sender: 'npc',
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, npcMessage]);
        } catch (error) {
            console.error("Failed to get NPC response:", error);
             const errorMessage: Message = {
                id: `error_${Date.now()}`,
                text: "Sorry, I'm having a little trouble thinking right now. Could you say that again?",
                sender: 'npc',
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, character, setMessages, updateCharacterAffinity]);
    
    const handleGetSuggestions = useCallback(async () => {
        return await geminiService.getDialogueOptions(messages, character);
    }, [messages, character]);

    return (
        <div className="flex-1 flex flex-col h-screen">
            <CharacterProfile character={character} />
            <MessageList messages={messages} npcAvatarUrl={character.avatarUrl} isLoading={isLoading} />
            <ChatInput onSendMessage={handleSendMessage} onGetSuggestions={handleGetSuggestions} isLoading={isLoading} />
        </div>
    );
};

export default ChatWindow;
