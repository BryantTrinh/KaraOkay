const { Client } = require("discord.js");
const client = new Client({ intents: ["GUILD_MESSAGES", "GUILD_SLASH_COMMANDS"] });
require('dotenv').config();

client.login(process.env.BOT_TOKEN);

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const pingCommand = {
        name: "ping",
        description: "Testing bot with ping command"
    };

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.commands.create(pingCommand);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }
});