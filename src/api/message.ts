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
}) =>
  fetchStream({
    url: "/send",
    method: "POST",
    data: {
      messages: config.messages
    },
    onMessage: config.onMessage,
  });
