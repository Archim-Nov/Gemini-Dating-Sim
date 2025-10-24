
import React from 'react';
import { Character } from '../types';
import { PlusIcon, LoadingIcon } from './icons';

interface CharacterListProps {
    characters: Character[];
    activeCharacterId: string | null;
    onSelectCharacter: (id: string) => void;
    onNewCharacter: () => void;
    isCreating: boolean;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, activeCharacterId, onSelectCharacter, onNewCharacter, isCreating }) => {
    return (
        <aside className="w-64 md:w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Conversations</h1>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {characters.map((char) => (
                    <div
                        key={char.id}
                        className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${
                            activeCharacterId === char.id
                                ? 'bg-indigo-100 dark:bg-indigo-900/50'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={() => onSelectCharacter(char.id)}
                    >
                        <img src={char.avatarUrl} alt={char.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                        <div className="flex-1">
                            <h3 className={`font-semibold ${activeCharacterId === char.id ? 'text-indigo-800 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'}`}>{char.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{char.personality}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={onNewCharacter}
                    disabled={isCreating}
                    className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {isCreating ? <LoadingIcon className="w-5 h-5 mr-2"/> : <PlusIcon className="w-5 h-5 mr-2" />}
                    {isCreating ? 'Creating...' : 'New Character'}
                </button>
            </div>
        </aside>
    );
};

export default CharacterList;
