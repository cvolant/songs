import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import Folders from '../folders/folders';
import Songs from '../songs/songs';

import { IMethodInvocation, ObjectIDSchema } from '../../types/collectionTypes';
import { ISong, SongSchema } from '../../types/songTypes';
import { IFolder, IUser } from '../../types';

// import Folders from '../folders/folders';

export const toggleFavorite = new ValidatedMethod({
  name: 'user.favoriteSong.toggle',
  validate: new SimpleSchema({
    songId: ObjectIDSchema,
    value: {
      type: Boolean,
      optional: true,
    },
  }).validator(),
  run(this: IMethodInvocation, {
    songId, value,
  }: { songId: Mongo.ObjectID; value?: boolean }): void {
    console.log('From api.user.favoriteSong.toggle. songId:', songId, 'value:', value);
    if (!this.userId) {
      throw new Meteor.Error(
        'api.user.favoriteSong.toggle.accessDenied',
        'Cannot manage favorite songs when not signed in',
      );
    }

    let write = true;
    const { favoriteSongs } = Meteor.users.findOne(this.userId) as IUser;
    const index = favoriteSongs
      .map((favoriteSong) => favoriteSong.toHexString())
      .indexOf(songId.toHexString());

    if (index < 0 && (value || value === undefined)) {
      favoriteSongs.unshift(songId);
    } else if (index >= 0 && !value) {
      favoriteSongs.splice(index, 1);
    } else {
      write = false;
    }

    if (write) {
      Meteor.users.update(this.userId, {
        $set: {
          favoriteSongs,
        },
      });
    }
  },
});

export const insertCreatedSong = new ValidatedMethod({
  name: 'user.createdSongs.insert',
  validate: new SimpleSchema({ song: SongSchema }).validator(),
  run(this: IMethodInvocation, { song }: { song: Partial<ISong> }): Mongo.ObjectID {
    if (!this.userId) {
      throw new Meteor.Error(
        'api.user.createdSongs.insert.accessDenied',
        'Cannot create a song when not signed in',
      );
    }

    const { createdSongs } = Meteor.users.findOne(this.userId) as IUser;

    const newSong = {
      userId: this.userId,
      updatedAt: new Date(),
      ...song,
    };
    const songId = Songs.insert(newSong as ISong) as unknown as Mongo.ObjectID;

    Meteor.users.update(this.userId, {
      $set: {
        createdSongs: [songId, ...createdSongs],
      },
    });

    console.log('From api.user.createdSongs.insert. songId:', songId);

    return songId;
  },
});

export const removeCreatedSong = new ValidatedMethod({
  name: 'user.createdSongs.remove',
  validate: new SimpleSchema({ _id: ObjectIDSchema }).validator(),
  run(this: IMethodInvocation, { _id }: { _id: Mongo.ObjectID }): void {
    if (!this.userId) {
      throw new Meteor.Error(
        'api.user.createdSongs.remove.accessDenied',
        'Cannot remove a song when not signed in',
      );
    }

    const { createdSongs } = Meteor.users.findOne(this.userId) as IUser;

    if (!createdSongs.map((createdSong) => createdSong.toHexString()).includes(_id.toHexString())) {
      throw new Meteor.Error(
        'api.user.createdSongs.remove.notFound',
        "Song does not exist in user's created songs list",
      );
    }

    const res = Songs.remove(_id);
    if (!res) {
      throw new Meteor.Error(
        'api.user.createdSongs.remove.failed',
        'Attempt to delete the song failed, please retry.',
      );
    }

    Meteor.users.update(this.userId, {
      $set: {
        createdSongs: createdSongs
          .filter((createdSong) => createdSong.toHexString() !== _id.toHexString()),
      },
    });
  },
});

export const insertFolder = new ValidatedMethod({
  name: 'user.folders.insert',
  validate: new SimpleSchema({
    name: {
      type: String,
      max: 100,
    },
    date: {
      type: Date,
      optional: true,
    },
  }).validator(),
  run(this: IMethodInvocation, { name, date }: { name: string; date: Date }): void {
    console.log('From user.folders.insert. this.userId:', this.userId);

    if (!this.userId) {
      throw new Meteor.Error(
        'api.user.folders.insert.accessDenied',
        'Cannot create a folder when not signed in',
      );
    }

    const folderId = Folders.insert({
      name,
      date,
      userId: this.userId,
      songs: [],
    } as unknown as IFolder);

    const { folders } = Meteor.users.findOne(this.userId) as IUser;

    const res = Meteor.users.update(this.userId, {
      $set: {
        folders: [folderId, ...folders],
      },
    });

    console.log('From user.folders.insert. folders:', folders, 'res:', res);
  },
});

export const removeFolder = new ValidatedMethod({
  name: 'user.folders.remove',
  validate: new SimpleSchema({ _id: ObjectIDSchema }).validator(),
  run(this: IMethodInvocation, { _id }: { _id: Mongo.ObjectID }): void {
    if (!this.userId) {
      throw new Meteor.Error(
        'api.user.folders.remove.accessDenied',
        'Cannot remove a folder when not signed in',
      );
    }

    const { folders } = Meteor.users.findOne(this.userId) as IUser;

    if (!folders.map((folder) => folder.toHexString()).includes(_id.toHexString())) {
      throw new Meteor.Error(
        'api.user.folders.remove.notFound',
        "Song does not exist in user's folders",
      );
    }

    Meteor.users.update(this.userId, {
      $set: {
        createdSongs: folders
          .filter((folder) => folder.toHexString() !== _id.toHexString()),
      },
    });
  },
});

const USERS_METHODS = [
  toggleFavorite,
  //  insertCreatedSong,
  removeCreatedSong,
  insertFolder,
  removeFolder,
].map((method) => method.name);

if (Meteor.isServer) {
  // Only allow 5 folders operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return (USERS_METHODS as string[]).includes(name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
