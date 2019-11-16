const { songs } = require('../../stories/fixtures');
const specialLog = require('./specialLog').default;

module.exports = {
  find: (args) => specialLog('Songs.find', songs)(args),
}