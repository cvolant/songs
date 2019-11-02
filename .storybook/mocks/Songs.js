// FIXME: we can't use ES6 imports in mocks, not sure why
module.exports = {
    find: (args) => {
      console.log(args);
      return [
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
      ];
    },
    _localStorage: window ? window.localStorage : { setItem: () => {}, getItem: () => {} },
    isClient: () => true,
    isServer: () => false,
    absoluteUrl: () => 'http://vulcanjs.org/'
}