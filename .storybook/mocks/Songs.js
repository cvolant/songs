// FIXME: we can't use ES6 imports in mocks, not sure why
const specialLog = (name, returnValue) => (args) => {
  console.log(`-SbMock- ${name}:`, args || returnValue);
  return returnValue;
};

module.exports = {
  find: (args) => specialLog('Songs.find', [
    {
      _id: 'idSong1',
      title: 'Song1',
    },
    {
      _id: 'idSong2',
      title: 'Song2',
    },
    {
      _id: 'idSong3',
      title: 'Song3',
    },
  ])(args),
}