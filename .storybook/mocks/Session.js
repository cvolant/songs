// FIXME: we can't use ES6 imports in mocks, not sure why
const specialLog = (name, returnValue) => (args) => {
  console.log(`-SbMock- ${name}:`, args || returnValue);
  return returnValue;
};

module.exports = {
  set: (args) => specialLog('Session.set:')(args),
  get: (args) => specialLog('Session.get:')(args),
}