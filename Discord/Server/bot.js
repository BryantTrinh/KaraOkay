import { config } from 'dotenv';
import { Client } from 'discord.js';

config();

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });
const TOKEN = process.env.BOT_TOKEN;


console.log('Bot is online');

client.login(TOKEN);

client.on("message", message => {
  if (message.content.toLowerCase() == "k.shutdown"){
    message.channel.send("KaraOkay has left the building T--T").then(() => {
      client.destroy();
    })
  }
})