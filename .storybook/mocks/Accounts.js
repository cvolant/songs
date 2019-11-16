const specialLog = require('./specialLog').default;

module.exports = {
  logout: () => specialLog('Account.logout')(),
}