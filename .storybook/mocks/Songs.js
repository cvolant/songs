const { songs } = require('../../stories/fixtures');
const specialLog = require('./specialLog').default;

module.exports = {
  find: (args) => {
    const returnedSongs = songs;
    returnedSongs.fetch = () => returnedSongs;
    return specialLog('Songs.find', returnedSongs)(args)
  },
  findOne: (args) => specialLog('Songs.findOne', songs[0])(args),
}