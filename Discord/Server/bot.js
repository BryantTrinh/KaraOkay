import { config } from 'dotenv';
import { Client } from 'discord.js';

config();

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });
const TOKEN = process.env.BOT_TOKEN;
client.login(TOKEN);

client.on("ready", () => {
  console.log('KaraOKAY has entered the building! \u{1F3A4}\u{1F9D1}');
  const channelId = '1149087508701917225';

  const channel = client.channels.cache.get(channelId);
  if (channel) {
    channel.send('KaraOKAY has entered the building! \u{1F3A4}\u{1F9D1}');
  } else {
    console.error(`Channel with ID ${channelId} not found.`);
  }
});
console.log('Bot is online');

