require('dotenv').config();
const { Client, IntentsBitField, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, VoiceConnectionStatus } = require('@discordjs/voice');
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const channelId = process.env.CHANNEL_ID; 
  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (channel) {
    const emoji = '🎤';
    channel.send(`KaraOKAY has handed you the mic! ${emoji}`);
  } else {
    console.error(`Channel with ID '{channelID}' not found.`);
  }
});

const pingCommand = [
  'ping'

];

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply("Pong!");
  }
});

client.login(process.env.BOT_TOKEN);