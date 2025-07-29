export interface MirrorConfig {
  chatMode?: boolean;
  debug?: boolean;
  logLevel?: "info" | "warn" | "error" | "debug";
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  startTime: Date;
  endTime?: Date;
}

export interface MindfulnessSession {
  id: string;
  type: "reflection" | "meditation" | "awareness" | "chat";
  duration?: number;
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

export interface MirrorCore {
  config: MirrorConfig;
  startChatSession(): Promise<ChatSession>;
  endChatSession(session: ChatSession): Promise<void>;
  reflect(prompt: string): Promise<string>;
}
