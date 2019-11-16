const specialLog = require('./specialLog').default;

module.exports = {
  set: (args) => specialLog('Session.set:')(args),
  get: (args) => specialLog('Session.get:')(args),
}