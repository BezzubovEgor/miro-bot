import React from "react";
import Markdown from "react-markdown";

import { Box, Paragraph } from "@mirohq/design-system";

import { AIHistoryItem } from "../model/types/aiChatService";

type ChatMessageProps = {
  message: AIHistoryItem;
};

const modelColor = 'rgba(169, 161, 249, 0.1)';
const userColor = 'rgba(134, 184, 255, 0.1)';
const errorColor = 'rgba(255, 0, 0, 0.1)';
const shadowColor = 'rgba(36, 38, 44, 0.2)';

const colors = {
  model: modelColor,
  user: userColor,
  error: errorColor,
};

const type = {
  model: '✦ MiroBot',
  user: 'You',
  error: 'Error',
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div>
      {message.parts.map((part, p_index) => (
        <Box
          key={p_index + "-box"}
          css={{
            backgroundColor:
              colors[message.role as keyof typeof colors] ?? modelColor,
            border: `1px solid ${shadowColor}`,
            boxShadow: `3px 3px ${shadowColor}`,
            padding: 15,
            fontSize: 14,
            marginBottom: 10,
          }}
        >
          <Paragraph
            key={p_index + "-p1"}
            weight="bold"
            css={{ paddingBottom: 8 }}
          >
            {type[message.role as keyof typeof type] ?? type.model}
          </Paragraph>
          <Markdown key={p_index + "-p2"} className="message">{part.text}</Markdown>
        </Box>
      ))}
    </div>
  );
};

export default ChatMessage;
