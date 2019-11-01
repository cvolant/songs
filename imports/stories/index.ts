import { Mongo as RealMongo } from 'meteor/mongo';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createDetails } from '../ui/Editor/Detail';

const id = (stringId: string): RealMongo.ObjectID => ({
  equals: (): boolean => false,
  toHexString: (): string => stringId,
});

export const song = {
  _id: id('idSong1'),
  userId: '1234',
  author: 'George Auteur',
  cnpl: true,
  classification: 'Cote123',
  compositor: 'Greg Compo',
  editor: 'Ed Lapointe',
  traductor: 'Nell Trad',
  newClassification: 'Ncoteabc',
  number: 123,
  year: 2000,
  subtitle: 'Sous-titre',
  title: 'Titre',
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
};

export const details = createDetails({
  author: {
    value: song.author,
  },
  compositor: {
    value: song.compositor,
  },
  editor: {
    value: song.editor,
  },
  classification: {
    value: song.classification,
  },
  newClassification: {
    value: song.newClassification,
  },
  number: {
    value: song.number,
  },
  year: {
    value: song.year,
  },
  cnpl: {
    value: song.cnpl,
  },
});

export const user = {
  _id: 'idUser1',
  favoriteSongs: [song._id],
  createdSongs: [song._id],
  folders: [] as RealMongo.ObjectID[],
  emails: [
    {
      address: 'user@test.com',
      verified: false,
    },
  ],
};

export const folders = [
  {
    _id: id('idFolder1'),
    name: 'Folder1',
    updatedAt: new Date(),
    userId: user._id,
    songs: [{ _id: id('idSong1') }],
  },
  {
    _id: id('idFolder2'),
    name: 'Folder2',
    updatedAt: new Date(),
    userId: user._id,
    songs: [],
  },
];

user.folders = folders.map((folder) => folder._id);

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
  userId: (): string | undefined => user._id,
  call: specialLog('Meteor.call:'),
};

export const Mongo = {
  Collection: specialLog('Mongo.Collection:'),
};
