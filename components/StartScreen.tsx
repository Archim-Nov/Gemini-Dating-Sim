
import React from 'react';

interface StartScreenProps {
  onNewCharacter: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onNewCharacter }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to Gemini Dating Sim
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Ready to meet someone new? Start a conversation and see where it goes. Every character is unique, powered by AI.
        </p>
        <button
          onClick={onNewCharacter}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-transform transform hover:scale-105 duration-300 ease-in-out"
        >
          Start a New Conversation
        </button>
      </div>
    </div>
  );
};
