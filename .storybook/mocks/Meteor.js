// FIXME: we can't use ES6 imports in mocks, not sure why
const specialLog = (name, returnValue) => (args) => {
  console.log(`-SbMock- ${name}:`, args || returnValue);
  return returnValue;
};

module.exports = {
  isClient: () => specialLog('Meteor.isClient', true)(),
  isServer: () => specialLog('Meteor.isServer', false)(),
  isStorybook: () => specialLog('Meteor.isStorybook', true)(),
  subscribe: (args) => specialLog('Meteor.subscribe', {
    stop: () => specialLog('Subscription.stop')(args),
  })(args),
  userId: () => specialLog('Meteor.userId', 'idUser1')(),
  call: (args) => specialLog('Meteor.call:')(args),
};

/*
const specialLog = ({name, returnValue, args}) => {
  console.log(`-SbMock- ${name}:`, args || returnValue);
  return returnValue;
};

module.exports = {
  isClient: () => specialLog({
    name: 'Meteor.isClient',
    returnValue: true,
  }),
  isServer: () => specialLog({
    name: 'Meteor.isServer',
    returnValue: false,
  }),
  isStorybook: () => specialLog({
    name: 'Meteor.isStorybook',
    returnValue: true,
  }),
  subscribe: (args) => specialLog({
    name: 'Meteor.subscribe',
    returnValue: {
      stop: () => specialLog({
        name: 'Subscription.stop',
        args,
      }),
    },
    args,
  }),
  userId: () => specialLog({
    name: 'Meteor.userId',
    returnValue: 'idUser1',
  }),
  call: (args) => specialLog({
    name: 'Meteor.call',
    args,
  }),
};
*/
