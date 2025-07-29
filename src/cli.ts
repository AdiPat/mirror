#!/usr/bin/env node

import { Command } from "commander";
import { ChatCLI } from "@/cli/chat.js";
import { Mirror } from "@/lib/mirror.js";

const program = new Command();

program
  .name("mirror")
  .description("MIRROR - A mindfulness companion CLI tool.")
  .version("0.1.0");

program
  .option("-c, --chat", "Start interactive chat session.")
  .option("-d, --debug", "Enable debug mode.")
  .option("-v, --verbose", "Verbose output.");

program
  .command("chat")
  .description("Start an interactive mindfulness chat session.")
  .action(async () => {
    const chatCLI = new ChatCLI();
    await chatCLI.start();
  });

program
  .command("reflect")
  .description("Get a quick reflection on a topic.")
  .argument("<prompt>", "The topic or question to reflect on.")
  .action(async (prompt: string) => {
    const mirror = new Mirror();
    const reflection = await mirror.reflect(prompt);
    console.log(`\n🪞 Reflection: ${reflection}.\n`);
  });

// Handle the --chat flag for shorthand access
program.action(async (options) => {
  if (options.chat) {
    const chatCLI = new ChatCLI();
    await chatCLI.start();
  } else {
    program.help();
  }
});

async function main(): Promise<void> {
  try {
    await program.parseAsync(process.argv);
  } catch (error) {
    console.error("Error:", error, ".");
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Unhandled error:", error, ".");
    process.exit(1);
  });
}
