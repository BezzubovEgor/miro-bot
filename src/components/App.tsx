"use client";
import { FC, KeyboardEventHandler, useEffect, useRef, useState } from "react";

import {
  Flex,
  IconButton,
  IconTrash,
  IconSparksFilled,
  IconPlusSquare,
  Textarea,
  Select,
  Heading
} from "@mirohq/design-system";

import { AIService } from "../model/services/client/AIService";
import { AIHistory } from "../model/types/aiChatService";
import { AgentSelector } from "../model/services/client/AgentSelector";
import { Loader } from "./Loader";
import { VoiceCommand } from "./VoiceCommand";
import ChatHistory from "./ChatHistory";

const buttonStyle = { borderRadius: 0, border: '1px solid #24262C', boxShadow: "2px 2px #24262C" };

export const App: FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLElement>(null);
  const [chatHistory, setChatHistory] = useState<AIHistory>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | undefined>();
  const [agent, setAgent] = useState<ReturnType<typeof AgentSelector.getSelectedAgent>>();

  useEffect(() => {
    miro.board.ui.on("icon:click", async () => {
      await miro.board.ui.openPanel({ url: "/" });
    });

    AIService.getHistory().then(setChatHistory);
    AIService.onHistoryUpdate((history) => {
      console.log('History updated!', history);
      setChatHistory(history);
    });

    console.log('BEFORE DROP');

    setAgent(AgentSelector.getSelectedAgent());

    miro.board.ui.on('drop', async ({ x, y }) => {
      // In this example: when the HTML element is dropped on the board, a sticky note is created
      console.log({ x, y });
    });
  }, []);

  const onSubmit = async (e: { preventDefault: () => void; } | undefined) => {
    e?.preventDefault();
    setIsProcessing(true);
    try {
      await AIService.sendMessage(
        inputRef.current?.value ?? "Ask me to enter smth",
        file ? new Uint8Array(await file?.arrayBuffer()) : undefined,
      );
    } finally {
      setIsProcessing(false);
      setFile(undefined);
      setPreview(undefined);
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setTimeout(() => {
        historyRef.current?.scrollTo({
          top: historyRef.current.scrollHeight,
          // behavior: 'smooth',
        });
        inputRef.current?.focus();
      }, 200);
    }
  };

  const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = async (event) => {
    const keyCode = event.key;
    if (keyCode === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit(undefined);
    }
  };

  const onCleanup = async () => AIService.clear();

  const onUploadClick = async () => {
    fileInputRef.current?.click();
  };
  const onUpload = async (event: any) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onAgentChange = async (value: string) => {
    AIService.clear();
    setAgent(value as "gemini" | "claude");
    AgentSelector.setSelectedAgent(value as "gemini" | "claude");
  };

  // "#86b8ff", "#aca3ff", "#cdff79", "#fe8080";
  const colors = ["#86b8ff", "#aca3ff"];
  const weights = ["bold", "normal"];

  const getRandColor = () => colors[Math.floor(Math.random() * colors.length)];
  const getRandWeight = () => weights[Math.floor(Math.random() * weights.length)];

  return (
    <Flex direction="column" justify="between" css={{ height: "100%" }}>
      {chatHistory.length === 0 &&
        <Flex css={{ height: '100%' }} justify="center" align="center">
          <Heading css={{ padding: 40, color: "$gray-300", textAlign: 'right' }} level={2}>
            {'You can ask MiroBot about anything, including manipulation of board content!'.split(' ').map((word, i) => <span key={i} style={{ color: getRandColor(), fontWeight: getRandWeight() }}>{word} </span>)}
          </Heading>
        </Flex>
      }
      <Flex
        ref={historyRef as any}
        direction="column"
        justify="start"
        css={{
          flexGrow: 1,
          maxHeight: "100%",
          overflow: "auto",
          padding: 10,
        }}
      >
        <ChatHistory messages={chatHistory} />
        {isProcessing && <Loader />}
      </Flex>
      <form onSubmit={onSubmit}>
        {preview && <img src={preview} width={70} height={70} style={{
          padding: "3px",
          marginLeft: "5px",
          border: "1px solid var(--colors-blue-200)",
          backgroundColor: "var(--colors-blue-100)",
          borderRadius: 8,
        }}></img>}
        <Flex
          gap={50}
          align="stretch"
          direction="column"
          css={{
            padding: "5px",
            border: "1px solid #24262C",
            margin: 10,
            backgroundColor: "#aca3ff",
            boxShadow: "5px 5px #24262C",
            paddingX: 10,
            paddingY: 15,
          }}
        >
          <Textarea
            rows={3}
            ref={inputRef}
            placeholder="Message MiroBot..."
            disabled={isProcessing}
            css={{ resize: 'none', fontSize: 13, borderRadius: 0, border: '1px solid #24262C' }}
            onKeyDown={onTextAreaKeyDown}
          />
          <Flex justify="between">
            <Flex gap={50}>
              <IconButton
                type="button"
                aria-label="clear"
                variant="outline"
                title="Clear"
                onPress={onCleanup}
                css={buttonStyle}
                disabled={isProcessing}
              >
                <IconTrash />
              </IconButton>
              <VoiceCommand css={buttonStyle} disabled={isProcessing} />
              <input
                ref={fileInputRef}
                type="file"
                onChange={onUpload}
                accept="image/png,image/jpeg,image/jpg"
                style={{ display: 'none' }}
                id="file-input"
                disabled={isProcessing}
              />
              <IconButton
                type="button"
                aria-label="clear"
                variant="outline"
                title="Attach"
                onPress={onUploadClick}
                css={buttonStyle}
                disabled={isProcessing}
              >
                <IconPlusSquare />
              </IconButton>

              <Select value={agent} onValueChange={onAgentChange} css={buttonStyle} disabled={isProcessing}>
                <Select.Trigger size='large' css={buttonStyle}>
                  <Select.Value placeholder='Select agent' />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content>
                    <Select.Item value='gemini'>Gemini</Select.Item>
                    <Select.Item value='claude'>Claude</Select.Item>
                  </Select.Content>
                </Select.Portal>
              </Select>
            </Flex>
            <IconButton
              aria-label="search"
              variant="solid-prominent"
              disabled={isProcessing}
              title="Send"
              css={buttonStyle}
            >
              <IconSparksFilled />
            </IconButton>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};
