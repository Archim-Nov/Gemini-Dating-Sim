
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';

interface MessageListProps {
    messages: Message[];
    npcAvatarUrl: string;
    isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, npcAvatarUrl, isLoading }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gray-100 dark:bg-gray-800/50">
            {messages.map((msg, index) => (
                <div key={msg.id} className={`flex items-end mb-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'npc' && (
                        <img src={npcAvatarUrl} alt="NPC" className="w-8 h-8 rounded-full mr-3 object-cover" />
                    )}
                    <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
                            msg.sender === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                        }`}
                    >
                        <p className="text-sm">{msg.text}</p>
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex items-end mb-4">
                    <img src={npcAvatarUrl} alt="NPC" className="w-8 h-8 rounded-full mr-3 object-cover" />
                    <div className="px-4 py-3 rounded-xl bg-white dark:bg-gray-700 rounded-bl-none">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default MessageList;
