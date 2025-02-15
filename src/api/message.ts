import { fetchStream } from "./request";

export interface MessageInfo {
  role: string;
  content: string;
}

export interface GPTStreamDelta {
  role?: string;
  content?: string;
}

export interface GPTResponseStreamData {
  index: number;
  delta: GPTStreamDelta;
  finish_reason: string;
}

export const sendMessage = (config: {
  messages: MessageInfo[];
  onMessage: (data: GPTResponseStreamData) => void;
}) => {
  const requestMessages = config.messages.map((message) => {
    if (message.role === "user") return message;
    return {
      role: message.role,
      content: message.content.replace(/<think>[\s\S]*?<\/think>/g, ""),
    };
  });
  return fetchStream({
    url: "/send",
    method: "POST",
    data: {
      messages: requestMessages,
    },
    onMessage: config.onMessage,
  });
};
