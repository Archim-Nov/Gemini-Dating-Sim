import React, { useState, useEffect, useCallback } from 'react';
import { Character, Message } from './types';
import { loadCharactersFromStorage, saveCharactersToStorage, loadConversationsFromStorage, saveConversationsToStorage } from './utils/localStorage';
import * as geminiService from './services/geminiService';
import CharacterList from './components/CharacterList';
import ChatWindow from './components/ChatWindow';
import { StartScreen } from './components/StartScreen';
import { LoadingIcon } from './components/icons';

const App: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [conversations, setConversations] = useState<Record<string, Message[]>>({});
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
    const [isLoadingNewCharacter, setIsLoadingNewCharacter] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setCharacters(loadCharactersFromStorage());
        setConversations(loadConversationsFromStorage());
    }, []);

    useEffect(() => {
        if (characters.length > 0) {
            saveCharactersToStorage(characters);
        }
    }, [characters]);

    useEffect(() => {
        if (Object.keys(conversations).length > 0) {
            saveConversationsToStorage(conversations);
        }
    }, [conversations]);

    const handleNewCharacter = useCallback(async () => {
        setIsLoadingNewCharacter(true);
        setError(null);
        try {
            const newCharacter = await geminiService.generateCharacterProfile();
            const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: newCharacter.bio,
                sender: 'npc',
                timestamp: new Date().toISOString(),
            };

            setCharacters(prev => [...prev, newCharacter]);
            setConversations(prev => ({ ...prev, [newCharacter.id]: [welcomeMessage] }));
            setActiveCharacterId(newCharacter.id);
        } catch (err) {
            console.error("Failed to generate new character:", err);
            setError("Sorry, I couldn't create a new character. Please try again.");
        } finally {
            setIsLoadingNewCharacter(false);
        }
    }, []);

    const activeCharacter = characters.find(c => c.id === activeCharacterId);

    return (
        <div className="flex h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
            <CharacterList
                characters={characters}
                activeCharacterId={activeCharacterId}
                onSelectCharacter={setActiveCharacterId}
                onNewCharacter={handleNewCharacter}
                isCreating={isLoadingNewCharacter}
            />
            <main className="flex-1 flex flex-col bg-white dark:bg-gray-800">
                {isLoadingNewCharacter && !activeCharacter && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <LoadingIcon className="w-12 h-12 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Creating someone new...</h2>
                        <p className="text-gray-500 dark:text-gray-400">Please wait a moment.</p>
                    </div>
                )}
                {error && (
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}
                {!isLoadingNewCharacter && activeCharacter ? (
                    <ChatWindow
                        key={activeCharacter.id}
                        character={activeCharacter}
                        messages={conversations[activeCharacter.id] || []}
                        setMessages={(updater) => {
                             setConversations(prev => {
                                const currentMessages = prev[activeCharacter.id] || [];
                                const newMessages = typeof updater === 'function' ? updater(currentMessages) : updater;
                                return { ...prev, [activeCharacter.id]: newMessages };
                            });
                        }}
                        updateCharacterAffinity={(charId, change) => {
                             setCharacters(prevChars => prevChars.map(c => 
                                c.id === charId ? { ...c, affinity: Math.max(0, Math.min(100, c.affinity + change)) } : c
                            ));
                        }}
                    />
                ) : !isLoadingNewCharacter && !error && (
                     <StartScreen onNewCharacter={handleNewCharacter} />
                )}
            </main>
        </div>
    );
};

export default App;