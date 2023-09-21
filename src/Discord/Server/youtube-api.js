const ytdl = require('ytdl-core');
require('dotenv').config();

const apiKey = process.env.YOUTUBE_KEY;
const songTitle = 'Song Title';

ytdl.getInfo(`ytsearch:${songTitle}`, { key: apiKey }, (error, info) => {
  if (error) {
    console.error(error);
    return;
  }
  if (!info || !info.items || info.items.length === 0) {
    console.error('No search results found.');
    return;
  }

  const firstSearchResult = info.items[0];
  const audioStreamURL = firstSearchResult.url;
  console.log(`Audio Stream URL: ${audioStreamURL}`);
});