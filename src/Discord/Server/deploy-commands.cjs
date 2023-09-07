const dotenv = require('dotenv');
dotenv.config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// Reads command files from the command directory
const commands = [];

function loadCommands() {
  const commandFiles = fs.readdirSync(path.resolve(__dirname, 'commands'));

  for (const file of commandFiles) {
    if (file.endsWith('.cjs')) {
      const filePath = path.resolve(__dirname, 'commands', file);
      const commandModule = require(filePath);
      if ('data' in commandModule && 'execute' in commandModule) {
        commands.push(commandModule.data.toJSON());
      } else {
        console.log(`[WARNING] The command in file ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
}

async function deployCommands() {
  try {
    console.log('Started refreshing application (/) commands.');

    loadCommands();

    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
}

deployCommands();
