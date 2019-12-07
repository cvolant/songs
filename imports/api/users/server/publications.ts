import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { publishComposite } from 'meteor/reywood:publish-composite';

import {
  IFolder,
  ISong,
  IUser,
} from '../../../types';
import { IMongoQueryOptions } from '../../../types/searchTypes';

import { Folders } from '../../folders/folders';
import Songs from '../../songs/songs';

Meteor.publish('user', function publishUser() {
  return Meteor.users.find(
    { _id: this.userId },
    { fields: { favoriteSongs: 1, createdSongs: 1, folders: 1 } },
  );
});

publishComposite('user.folders', (options: IMongoQueryOptions) => ({
  find(this: { userId: string }): Mongo.Cursor<IUser> {
    return Meteor.users.find({ _id: this.userId }, { fields: { folders: 1 } });
  },

  children: [{
    find(user: IUser): Mongo.Cursor<IFolder> {
      return Folders.find(
        { _id: { $in: user.folders } },
        options,
      );
    },

    children: [{
      find(folder: IFolder): Mongo.Cursor<ISong> {
        return Songs.find(
          { _id: { $in: folder.songs.map((song) => song._id) } },
          { fields: { title: 1 } },
        );
      },
    }],
  }],
}));

publishComposite('user.favoriteSongs', (options: IMongoQueryOptions) => ({
  find(this: { userId: string }): Mongo.Cursor<IUser> {
    return Meteor.users.find({ _id: this.userId }, { fields: { favoriteSongs: 1 } });
  },

  children: [{
    find(user: IUser): Mongo.Cursor<ISong> {
      return Songs.find({ _id: { $in: user.favoriteSongs } }, options);
    },
  }],
}));

publishComposite('user.createdSongs', (options: IMongoQueryOptions) => ({
  find(this: { userId: string }): Mongo.Cursor<IUser> {
    return Meteor.users.find({ _id: this.userId }, { fields: { createdSongs: 1 } });
  },

  children: [{
    find(user: IUser): Mongo.Cursor<ISong> {
      return Songs.find({ _id: { $in: user.createdSongs } }, options);
    },
  }],
}));
