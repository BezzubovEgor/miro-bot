import React from 'react';
import { AIHistoryItem } from '../model/types/aiChatService';
import ChatMessage from './ChatMessage';


interface ChatHistoryProps {
    messages: AIHistoryItem[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
    return (
        <div>
            {messages.map((message, m_index) => (
                <ChatMessage key={m_index} message={message} />
            ))}
        </div>
    );
};

export default ChatHistory;
