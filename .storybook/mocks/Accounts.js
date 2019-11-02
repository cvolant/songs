// FIXME: we can't use ES6 imports in mocks, not sure why
const specialLog = (name, returnValue) => (args) => {
  console.log(`-SbMock- ${name}:`, args || returnValue);
  return returnValue;
};

module.exports = {
  logout: () => specialLog('Account.logout')(),
}