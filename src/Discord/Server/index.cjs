require('dotenv').config();
const { Client, IntentsBitField, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, getVoiceConnection } = require('@discordjs/voice');
const { OpusEncoder } = require('@discordjs/opus');
const { YouTube } = require('youtube-sr');
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

  try {
    const results = await YouTube.search(query, { limit: 1 });

    if (results.length === 0) {
      await interaction.reply('No videos found for the given query.');
      return;
    }

    const videoUrl = results[0].url;
    const stream = ytdl(videoUrl, { filter: 'audioonly' });
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    console.log(`Voice connection: ${connection}`);

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
  } catch (error) {
    console.error('Error while playing song:', error);
    await interaction.reply('An error occurred while playing this song:');
  }
} else if (commandName === 'leave') {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply('Bork! You must be in a voice channel to use this command.');
      return;
    }
    const connection = getVoiceConnection(voiceChannel.guild.id);
    if (connection) {
      console.log('Found a voice connection, stopping player and destroying connection.');
      connection.state.audioPlayer.stop(); 
      connection.destroy(); 
          console.log(`Bot is currently in voice channel: ${connection.joinConfig.channelId}`);
      await interaction.reply('Leaving the voice channel');
    } else {
      console.log('No voice connection found.');
      await interaction.reply('I am not in a voice channel');
    }
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