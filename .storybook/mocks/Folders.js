const { folders } = require('../../stories/fixtures');
const specialLog = require('./specialLog').default;

module.exports = {
  find: (args) => {
    const returnedFolders = folders;
    returnedFolders.fetch = () => returnedFolders;
    return specialLog('Folders.find', returnedFolders)(args)
  },
  findOne: (args) => specialLog('Folders.findOne', folders[0])(args),
}