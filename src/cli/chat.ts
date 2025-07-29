import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import { Mirror } from "@/lib/mirror.js";
import type { ChatSession } from "@/types/index.js";

export class ChatCLI {
  private mirror: Mirror;
  private session: ChatSession | null = null;

  constructor() {
    this.mirror = new Mirror({ chatMode: true, debug: false });
  }

  async start(): Promise<void> {
    // Display figlet banner
    const banner = figlet.textSync("MIRROR", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    });
    console.log(chalk.blue.bold("\n" + banner));

    console.log(chalk.blue.bold("🪞 Welcome to MIRROR Chat."));
    console.log(chalk.gray("A mindfulness companion for self-reflection.\n"));
    console.log(chalk.gray('Type "exit" or "quit" to end the session.\n'));

    this.session = await this.mirror.startChatSession();

    // Show welcome message
    const welcomeMessage = this.session.messages[0];
    console.log(chalk.green("✨ MIRROR: ") + welcomeMessage.content + ".\n");

    await this.chatLoop();
  }

  private async chatLoop(): Promise<void> {
    while (true) {
      const { input } = await inquirer.prompt([
        {
          type: "input",
          name: "input",
          message: chalk.cyan("You:"),
          validate: (input: string) => {
            if (!input.trim()) {
              return "Please enter a message.";
            }
            return true;
          },
        },
      ]);

      const userInput = input.trim();

      if (
        userInput.toLowerCase() === "exit" ||
        userInput.toLowerCase() === "quit"
      ) {
        await this.endChat();
        break;
      }

      if (this.session) {
        this.mirror.addMessage(this.session.id, "user", userInput);
        const reflection = await this.mirror.reflect(userInput);
        this.mirror.addMessage(this.session.id, "assistant", reflection);

        console.log(chalk.green("\n🪞 MIRROR: ") + reflection + "\n");
      }
    }
  }

  private async endChat(): Promise<void> {
    if (this.session) {
      await this.mirror.endChatSession(this.session);
      console.log(
        chalk.yellow("\n✨ Thank you for using MIRROR. Take care! 🌟.\n")
      );
    }
  }
}
