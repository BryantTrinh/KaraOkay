const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const commands = [
  {
    name: 'ping',
    description: 'Ping the bot!',
  },
  {
    name: 'play',
    description: 'Play music in a voice channel',
    options: [
      {
        name: 'query',
        description: 'Enter a song title',
        type: 3, // 3 represents STRING
        required: true,
      },
    ],
  },
  {
    name: 'leave',
    description: 'Bot leaves the voice channel',
  },
];

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
      body: commands,
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();