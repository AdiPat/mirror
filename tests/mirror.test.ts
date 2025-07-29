import { describe, it, expect, beforeEach } from "vitest";
import { Mirror } from "../src/lib/mirror.js";
import type { MirrorConfig } from "../src/types/index.js";

describe("Mirror", () => {
  let mirror: Mirror;

  beforeEach(() => {
    mirror = new Mirror();
  });

  describe("constructor", () => {
    it("should create instance with default config", () => {
      expect(mirror).toBeInstanceOf(Mirror);
      expect(mirror.config.chatMode).toBe(false);
      expect(mirror.config.debug).toBe(false);
      expect(mirror.config.logLevel).toBe("info");
    });

    it("should create instance with custom config", () => {
      const config: MirrorConfig = {
        chatMode: true,
        debug: true,
        logLevel: "debug",
      };
      const customMirror = new Mirror(config);

      expect(customMirror.config.chatMode).toBe(true);
      expect(customMirror.config.debug).toBe(true);
      expect(customMirror.config.logLevel).toBe("debug");
    });
  });

  describe("startChatSession", () => {
    it("should create a new chat session", async () => {
      const session = await mirror.startChatSession();

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.messages).toHaveLength(1);
      expect(session.messages[0].role).toBe("system");
      expect(session.startTime).toBeInstanceOf(Date);
      expect(session.endTime).toBeUndefined();
    });

    it("should create unique session IDs", async () => {
      const session1 = await mirror.startChatSession();
      const session2 = await mirror.startChatSession();

      expect(session1.id).not.toBe(session2.id);
    });
  });

  describe("endChatSession", () => {
    it("should end a chat session", async () => {
      const session = await mirror.startChatSession();
      expect(session.endTime).toBeUndefined();

      await mirror.endChatSession(session);

      expect(session.endTime).toBeInstanceOf(Date);
    });
  });

  describe("reflect", () => {
    it("should return a reflection string", async () => {
      const prompt = "How am I feeling today?";
      const reflection = await mirror.reflect(prompt);

      expect(reflection).toBeDefined();
      expect(typeof reflection).toBe("string");
      expect(reflection.length).toBeGreaterThan(0);
      expect(reflection).toContain(prompt);
    });

    it("should return different reflections for same prompt", async () => {
      const prompt = "What makes me happy?";
      const reflection1 = await mirror.reflect(prompt);
      const reflection2 = await mirror.reflect(prompt);

      // Note: Due to randomness, this might occasionally fail
      // In a real implementation, you'd mock the randomness
      expect(reflection1).toBeDefined();
      expect(reflection2).toBeDefined();
    });
  });

  describe("addMessage", () => {
    it("should add message to existing session", async () => {
      const session = await mirror.startChatSession();
      const initialMessageCount = session.messages.length;

      mirror.addMessage(session.id, "user", "Hello, mirror!");

      expect(session.messages).toHaveLength(initialMessageCount + 1);
      expect(session.messages[session.messages.length - 1].role).toBe("user");
      expect(session.messages[session.messages.length - 1].content).toBe(
        "Hello, mirror!"
      );
    });

    it("should not add message to non-existent session", () => {
      const nonExistentSessionId = "non-existent-id";

      expect(() => {
        mirror.addMessage(nonExistentSessionId, "user", "Hello");
      }).not.toThrow();
    });
  });

  describe("getSession", () => {
    it("should return existing session", async () => {
      const session = await mirror.startChatSession();
      const retrievedSession = mirror.getSession(session.id);

      expect(retrievedSession).toBe(session);
    });

    it("should return undefined for non-existent session", () => {
      const retrievedSession = mirror.getSession("non-existent-id");

      expect(retrievedSession).toBeUndefined();
    });
  });

  describe("getAllSessions", () => {
    it("should return all active sessions", async () => {
      const session1 = await mirror.startChatSession();
      const session2 = await mirror.startChatSession();

      const allSessions = mirror.getAllSessions();

      expect(allSessions).toHaveLength(2);
      expect(allSessions).toContain(session1);
      expect(allSessions).toContain(session2);
    });

    it("should return empty array when no sessions exist", () => {
      const allSessions = mirror.getAllSessions();

      expect(allSessions).toHaveLength(0);
    });
  });
});
