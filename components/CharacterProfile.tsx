
import React from 'react';
import { Character } from '../types';
import { HeartIcon } from './icons';

interface CharacterProfileProps {
    character: Character;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({ character }) => {
    const affinityColor = character.affinity < 30 ? 'bg-red-500' : character.affinity < 70 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-4 bg-white dark:bg-gray-800">
            <img src={character.avatarUrl} alt={character.name} className="w-14 h-14 rounded-full object-cover" />
            <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{character.name}, {character.age}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{character.occupation} - {character.personality}</p>
                 <div className="flex items-center mt-1">
                    <HeartIcon className="w-5 h-5 text-pink-500 mr-2" />
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div className={`${affinityColor} h-2.5 rounded-full`} style={{ width: `${character.affinity}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterProfile;
