// FIXME: we can't use ES6 imports in mocks, not sure why
const specialLog = (name, returnValue) => (args) => {
  console.log(`-SbMock- ${name}:`, args || returnValue);
  return returnValue;
};

module.exports = {
  find: (args) => specialLog('Folders.find', [
    {
      _id: 'idFolder1',
      name: 'Folder1',
      userId: 'idUser1',
      songs: [{ toHexSting: () => 'idSong1' }, { toHexSting: () => 'idSong2' }],
    },
    {
      _id: 'idFolder2',
      name: 'Folder2',
      userId: 'idUser1',
      songs: [],
    },
    {
      _id: 'idFolder3',
      name: 'Folder3',
      userId: 'idUser2',
      songs: [],
    },
  ])(args),
}