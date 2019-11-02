// FIXME: we can't use ES6 imports in mocks, not sure why
const specialLog = (name, returnValue) => (args) => {
  console.log(`-SbMock- ${name}:`, args || returnValue);
  return returnValue;
};

module.exports = {
  isClient: () => specialLog('Meteor.isClient', true)(),
  isServer: () => specialLog('Meteor.isServer', false)(),
  isStorybook: () => specialLog('Meteor.isStorybook', true)(),
  subscribe: (args) => specialLog('Meteor.subscribe')(args),
  userId: () => specialLog('Meteor.userId', 'idUser1')(),
  call: (args) => specialLog('Meteor.call:')(args),
}