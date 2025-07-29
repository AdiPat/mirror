import { describe, it, expect } from "vitest";
import {
  generateId,
  formatTimestamp,
  isValidEmail,
  sanitizeInput,
  sleep,
} from "../src/utils/helpers.js";

describe("Helpers", () => {
  describe("generateId", () => {
    it("should generate a string ID", () => {
      const id = generateId();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });

    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it("should generate hex string", () => {
      const id = generateId();
      expect(id).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe("formatTimestamp", () => {
    it("should format date as ISO string", () => {
      const date = new Date("2023-01-01T00:00:00.000Z");
      const formatted = formatTimestamp(date);
      expect(formatted).toBe("2023-01-01T00:00:00.000Z");
    });

    it("should handle current date", () => {
      const now = new Date();
      const formatted = formatTimestamp(now);
      expect(formatted).toBe(now.toISOString());
    });
  });

  describe("isValidEmail", () => {
    it("should validate correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.org")).toBe(true);
      expect(isValidEmail("hello+tag@test.co.uk")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("missing@domain")).toBe(false);
      expect(isValidEmail("@missing-local.com")).toBe(false);
      expect(isValidEmail("spaces @domain.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("sanitizeInput", () => {
    it("should trim whitespace", () => {
      expect(sanitizeInput("  hello  ")).toBe("hello");
      expect(sanitizeInput("\t\ntest\t\n")).toBe("test");
    });

    it("should remove dangerous characters", () => {
      expect(sanitizeInput('hello<script>alert("xss")</script>')).toBe(
        'helloscriptalert("xss")/script'
      );
      expect(sanitizeInput("test>dangerous")).toBe("testdangerous");
    });

    it("should handle empty strings", () => {
      expect(sanitizeInput("")).toBe("");
      expect(sanitizeInput("   ")).toBe("");
    });
  });

  describe("sleep", () => {
    it("should resolve after specified time", async () => {
      const start = Date.now();
      await sleep(50);
      const end = Date.now();
      const elapsed = end - start;

      // Allow some tolerance for timer precision
      expect(elapsed).toBeGreaterThanOrEqual(45);
      expect(elapsed).toBeLessThan(100);
    });

    it("should resolve immediately for 0ms", async () => {
      const start = Date.now();
      await sleep(0);
      const end = Date.now();
      const elapsed = end - start;

      expect(elapsed).toBeLessThan(10);
    });
  });
});
