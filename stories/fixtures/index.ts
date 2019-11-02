import { Mongo as RealMongo } from 'meteor/mongo';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createDetails } from '../../imports/ui/Editor/Detail';

const id = (stringId: string): RealMongo.ObjectID => ({
  equals: (): boolean => false,
  toHexString: (): string => stringId,
});

export const users = [
  {
    _id: 'idUser1',
    favoriteSongs: [] as RealMongo.ObjectID[],
    createdSongs: [] as RealMongo.ObjectID[],
    folders: [] as RealMongo.ObjectID[],
    emails: [
      {
        address: 'user1@test.com',
        verified: true,
      },
    ],
  },
  {
    _id: 'idUser2',
    favoriteSongs: [] as RealMongo.ObjectID[],
    createdSongs: [] as RealMongo.ObjectID[],
    folders: [] as RealMongo.ObjectID[],
    emails: [
      {
        address: 'user2@test.com',
        verified: false,
      },
    ],
  },
];

export const songs = [
  {
    _id: id('idSong1'),
    userId: users[0]._id,
    author: 'George Auteur',
    cnpl: true,
    classification: 'Cote123',
    compositor: 'Greg Compo',
    editor: 'Ed Lapointe',
    traductor: 'Nell Trad',
    newClassification: 'Ncoteabc',
    number: 123,
    year: 2000,
    subtitle: 'Sous-titre1',
    title: 'Chant 1',
    pg: [
      {
        label: 'refrain',
        pg: 'Frere Jacques ! Frere Jacques !',
        index: 0,
      },
      {
        label: 'couplet',
        pg: 'Dormez-vous ? Dormez-vous ?',
        index: 1,
      },
      {
        label: 'couplet',
        pg: 'Sonnez les matines ! Sonnez les matines !',
        index: 2,
      },
      {
        label: 'couplet',
        pg: 'Ding ding dong ! Ding ding dong !',
        index: 3,
      },
    ],
  },
  {
    _id: id('idSong2'),
    userId: users[1]._id,
    author: 'Bobby Lapointe',
    cnpl: true,
    classification: 'Cote456',
    compositor: 'Mozart',
    editor: 'Les ptits CD',
    traductor: 'Minnie',
    newClassification: 'Ncotedef',
    number: 456,
    year: 1980,
    subtitle: 'Sous-titre2',
    title: 'Chant 2',
    pg: [
      {
        label: 'refrain',
        pg: 'Moi je connais une chanson qui emmerde les gens',
        index: 0,
      },
    ],
  },
];

export const details = createDetails({
  author: {
    value: songs[0].author,
  },
  compositor: {
    value: songs[0].compositor,
  },
  editor: {
    value: songs[0].editor,
  },
  classification: {
    value: songs[0].classification,
  },
  newClassification: {
    value: songs[0].newClassification,
  },
  number: {
    value: songs[0].number,
  },
  year: {
    value: songs[0].year,
  },
  cnpl: {
    value: songs[0].cnpl,
  },
});

export const folders = [
  {
    _id: id('idFolder1'),
    date: new Date('2020/01/10'),
    name: 'Folder1',
    sharedWith: [users[1]._id || ''],
    songs,
    updatedAt: new Date('2019/10/10'),
    userId: users[0]._id || '',
  },
  {
    _id: id('idFolder2'),
    date: new Date('2020/05/11'),
    name: 'Folder2',
    sharedWith: [users[0]._id || ''],
    songs,
    updatedAt: new Date(),
    userId: users[1]._id || '',
  },
  {
    _id: id('idFolder3'),
    date: new Date('2019/12/11'),
    name: 'Folder3',
    sharedWith: [],
    songs: [songs[0]],
    updatedAt: new Date('2019/11/01'),
    userId: users[0]._id || '',
  },
];

users[0].folders = folders
  .filter((folder) => folder.userId === users[0]._id)
  .map((folder) => folder._id);
users[1].folders = folders
  .filter((folder) => folder.userId === users[1]._id)
  .map((folder) => folder._id);
users[0].favoriteSongs = songs.map((song) => song._id);
users[1].favoriteSongs = [songs[0]._id];
users[0].createdSongs = [songs[1]._id];
users[1].createdSongs = [songs[0]._id];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const specialLog = (name: string) => (args: any): void => {
  console.log(`-------StorybookLog------- ${name}:`, args);
};

export const Session = {
  set: specialLog('Session.set:'),
  get: specialLog('Session.get:'),
};

export const Meteor = {
  subscribe: specialLog('Meteor.subscribe'),
  userId: (): string | undefined => users[0]._id,
  call: specialLog('Meteor.call:'),
};

export const Mongo = {
  Collection: specialLog('Mongo.Collection:'),
};