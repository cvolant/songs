const { users } = require('../../stories/fixtures');
const specialLog = require('./specialLog').default;

module.exports = {
  isClient: () => specialLog('Meteor.isClient', true)(),
  isServer: () => specialLog('Meteor.isServer', false)(),
  isStorybook: () => specialLog('Meteor.isStorybook', true)(),
  subscribe: (subscriptionName, options, callback) => {
    if (callback) callback();   // Needs a setTimeout, but it does not work: '"exports" is readonly'...
    // setTimeout(callback, 5000);
    // setTimeout.__promisify__(5000).then(callback);
    return specialLog('Meteor.subscribe', {
      ready: () => true,  // Also needs a setTimeout, or a createdAt: new Date() + ready: () => new Date().valueOf() + 2000 > createdAt...
      stop: () => specialLog('Subscription.stop')(subscriptionName),
    })(subscriptionName, options);
  },
  user: () => specialLog('Meteor.user', users[0])(),
  userId: () => specialLog('Meteor.userId', users[0]._id)(),
  call: (args) => specialLog('Meteor.call')(args),
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
