const { broadcasts } = require('../../../stories/fixtures');
const specialLog = require('../specialLog').default;

module.exports = {
  call: (args, callback) => {
    specialLog('broadcastGetAddresses')(args);
    callback(null, broadcasts[0].addresses);
  },
};
 