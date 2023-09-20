const ytdl = require('ytdl-core');
require('dotenv').config();

const apiKey = process.env.YOUTUBE_KEY;
const videoURL = 'https://www.youtube.com/watch?v=VIDEO_ID';

ytdl.getInfo(videoURL, { key: apiKey }, (error, info) => {
  if (error) {
    console.error(error);
    return;
  }
  const audioStreamURL = info.formats.find(format => format.itag === 140).url;
});
