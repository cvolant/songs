const { folders } = require('../../stories/fixtures');
const specialLog = require('./specialLog').default;

module.exports = {
  find: (args) => specialLog('Folders.find', folders)(args),
}