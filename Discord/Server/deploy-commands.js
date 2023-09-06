import { CommandoClient } from 'discord.js-commando';
import { config } from 'dotenv';

config();

const client = new CommandoClient({
  commandPrefix: '/'
  owner: 296181275344109568, 
});

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerGroup('karaoke', 'Karaoke Commands')
  .registerCommands([
    {
      name: 'startkaraoke',
      group: 'karaoke',
      memberName: 'startkaraoke',
      description: 'Start a karaoke session.',
    },
    {
      name: 'endkaraoke',
      group: 'karaoke',
      memberName: 'endkaraoke',
      description: 'End current karaoke session',
    },
  ]);

client.login(process.env.BOT_TOKEN);
