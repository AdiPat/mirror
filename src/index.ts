// Main library exports
export { Mirror } from "@/lib/mirror.js";
export { ChatCLI } from "@/cli/chat.js";

// Type exports
export type {
  MirrorConfig,
  MirrorCore,
  ChatMessage,
  ChatSession,
  MindfulnessSession,
} from "@/types/index.js";

// Utility exports
export {
  generateId,
  formatTimestamp,
  isValidEmail,
  sanitizeInput,
  sleep,
} from "@/utils/helpers.js";
