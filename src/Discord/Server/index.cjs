require('dotenv').config();
const { Client, IntentsBitField, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

const prefix = '/';

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  
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

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'play') {
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        await interaction.reply('BORK! You must be in a voice channel to use this command.');
        return;
      }
      const query = interaction.options.getString('query');

      const stream = ytdl(query, { filter: 'audioonly' });

      const connection = joinVoiceChannel({
        // channelId: process.env.CHANNEL_ID,
        channelId: voiceChannel.id,
        // guildId: process.env.GUILD_ID,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      console.log(`Bot is attempting to join voice channel: ${voiceChannel.name}`);
      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      });
    const resource = createAudioResource(stream, { inputType: 'opus' });
    player.play(resource);
    
    connection.subscribe(player);
    
    player.on('stateChange', (oldState, newState) => {
    console.log(`Player state change: ${oldState.status} -> ${newState.status}`);
    if (newState.status === 'idle') {
    console.log(`Finished playing in voice channel: ${voiceChannel.name}`);
        connection.destroy();
      }
    });
  }
});
  client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const query = args.join(' ');

    if (command === 'play') {
      message.reply('Please use the /play slash command instead.');
    }
  });

client.login(process.env.BOT_TOKEN);