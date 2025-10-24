
import React, { useState } from 'react';
import { SendIcon, SparklesIcon, LoadingIcon } from './icons';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    onGetSuggestions: () => Promise<string[]>;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onGetSuggestions, isLoading }) => {
    const [text, setText] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !isLoading) {
            onSendMessage(text);
            setText('');
            setSuggestions([]);
        }
    };

    const handleGetSuggestionsClick = async () => {
        setIsSuggesting(true);
        try {
            const newSuggestions = await onGetSuggestions();
            setSuggestions(newSuggestions);
        } catch (error) {
            console.error("Failed to get suggestions:", error);
            setSuggestions(["Sorry, couldn't get suggestions."]);
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        onSendMessage(suggestion);
        setText('');
        setSuggestions([]);
    };

    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {suggestions.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSuggestionClick(s)}
                            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-sm rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <button
                    type="button"
                    onClick={handleGetSuggestionsClick}
                    disabled={isLoading || isSuggesting}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Get AI suggestions"
                >
                    {isSuggesting ? <LoadingIcon className="w-6 h-6"/> : <SparklesIcon className="w-6 h-6 text-yellow-500" />}
                </button>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!text.trim() || isLoading}
                    className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
