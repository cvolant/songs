import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';

import { ISong } from '../../../types';
import { IMongoQueryOptions } from '../../../types/searchTypes';
import { IUnfetchedFolder, IFolder } from '../../../types/folderTypes';

import Songs from '../songs';
import Folders from '../../folders/folders';

Meteor.publish('song', (_id: Mongo.ObjectID) => {
  console.log('From songs, publish song. _id:', _id);
  return Songs.find(_id);
});

Meteor.publish('songs', ({
  query, options,
}: {
  query: Mongo.Query<ISong>;
  options: IMongoQueryOptions;
}) => Songs.find(query, options as IMongoQueryOptions));

publishComposite('songs.inFolder', function songsInFolder(
  this: { userId: string }, { folder, options }: {
    folder: IUnfetchedFolder;
    options: IMongoQueryOptions;
  },
) {
  console.log('From songs.inFolder. Before schema validation.');
  Folders.schema.validate(folder);

  const { _id } = folder;
  const { userId } = this;

  console.log('From songs.inFolder. _id:', _id, 'userId:', userId, '\nfolder:', folder, '\noptions:', options);

  return {
    find: (): Mongo.Cursor<IFolder> => Folders.find(
      { _id, userId },
      { fields: { songs: 1 } },
    ),

    children: [{
      find: (foundFolder: IFolder): Mongo.Cursor<ISong> => {
        console.log('$in:', foundFolder.songs.map((song) => song._id));
        return Songs.find(
          { _id: { $in: foundFolder.songs.map((song) => song._id) } },
          options,
        );
      },
    }],
  };
});
