console.log("Initialising...");

require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const keywords = require("./commands/keywords");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

// Permissions
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(process.env.DISCORD_TOKEN);

client.once(Events.ClientReady, (c) => {
  console.log(`The ${c.user.tag} is ready to roll!`);
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Checking for "data" and "execute" properties in command files.
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `WARNING: The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);
});

// Listens to GuildMessages, converts to lowercase and checks for matches within keywords.js

client.on("messageCreate", (message) => {
  recievedMessage = message.content.toLowerCase();
  keyword = keywords.find(({ keyword }) => recievedMessage.includes(keyword));
  keyword ? message.reply(keyword.reply) : null;
});
