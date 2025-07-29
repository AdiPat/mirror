import type {
  MirrorConfig,
  MirrorCore,
  ChatSession,
  ChatMessage,
} from "@/types/index.js";
import { generateId } from "@/utils/helpers.js";

export class Mirror implements MirrorCore {
  public config: MirrorConfig;
  private activeSessions: Map<string, ChatSession> = new Map();

  constructor(config: MirrorConfig = {}) {
    this.config = {
      chatMode: false,
      debug: false,
      logLevel: "info",
      ...config,
    };
  }

  async startChatSession(): Promise<ChatSession> {
    const session: ChatSession = {
      id: generateId(),
      messages: [
        {
          role: "system",
          content:
            "Welcome to MIRROR - a mindfulness companion. How are you feeling today?",
          timestamp: new Date(),
        },
      ],
      startTime: new Date(),
    };

    this.activeSessions.set(session.id, session);
    return session;
  }

  async endChatSession(session: ChatSession): Promise<void> {
    session.endTime = new Date();
    this.activeSessions.delete(session.id);

    if (this.config.debug) {
      console.log(
        `Chat session ${session.id} ended after ${session.messages.length} messages.`
      );
    }
  }

  async reflect(prompt: string): Promise<string> {
    // Simple reflection mechanism - in a real implementation,
    // this might use AI or sophisticated processing
    const reflections = [
      `Take a moment to breathe and consider: ${prompt}`,
      `What does this mean to you right now: ${prompt}`,
      `Notice how you feel when you think about: ${prompt}`,
      `What would you tell a friend who shared this with you: ${prompt}`,
    ];

    const randomReflection =
      reflections[Math.floor(Math.random() * reflections.length)];
    return randomReflection;
  }

  addMessage(
    sessionId: string,
    role: ChatMessage["role"],
    content: string
  ): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.messages.push({
        role,
        content,
        timestamp: new Date(),
      });
    }
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  getAllSessions(): ChatSession[] {
    return Array.from(this.activeSessions.values());
  }
}
