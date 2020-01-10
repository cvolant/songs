const { broadcasts } = require('../../stories/fixtures');
const specialLog = require('./specialLog').default;

module.exports = {
  find: (args) => {
    const returnedBroadcasts = broadcasts;
    returnedBroadcasts.fetch = () => returnedBroadcasts;
    return specialLog('Broadcasts.find', returnedBroadcasts)(args)
  },
  findOne: (args) => specialLog('Broadcasts.findOne', broadcasts[0])(args),
}