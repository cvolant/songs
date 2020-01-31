import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import Folders from '../folders/folders';
import Songs from '../songs/songs';

import { ObjectIDSchema } from '../../types/collectionTypes';
import { ISong, SongSchema } from '../../types/songTypes';
import { IFolder, IUser } from '../../types';
import Broadcasts from '../broadcasts/broadcasts';

// import Folders from '../folders/folders';

export const userFavoriteToggle = new ValidatedMethod({
  name: 'user.favoriteSong.toggle',
  validate: new SimpleSchema({
    songId: ObjectIDSchema,
    value: {
      type: Boolean,
      optional: true,
    },
  }).validator(),
  run({ songId, value }: {
    songId: Mongo.ObjectID;
    value?: boolean;
  }): void {
    // console.log('From api.user.favoriteSong.toggle. songId:', songId, 'value:', value);
    if (!this.userId) {
      throw new Meteor.Error(
        'api.user.favoriteSong.toggle.accessDenied',
        'Cannot manage favorite songs when not signed in',
      );
    }

    let write = true;
    let { favoriteSongs } = Meteor.users.findOne(this.userId) as IUser;
    if (favoriteSongs) {
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
    } else {
      favoriteSongs = [songId];
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

export const userCreatedSongInsert = new ValidatedMethod({
  name: 'user.createdSongs.insert',
  validate: new SimpleSchema({ song: SongSchema }).validator(),
  run({ song }: { song: Mongo.OptionalId<ISong> }): Mongo.ObjectID {
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
    const songId = Songs.insert(newSong) as unknown as Mongo.ObjectID;

    Meteor.users.update(this.userId, {
      $set: {
        createdSongs: [songId, ...createdSongs || []],
      },
    });

    // console.log('From api.user.createdSongs.insert. songId:', songId);

    return songId;
  },
});

export const userCreatedSongRemove = new ValidatedMethod({
  name: 'user.createdSongs.remove',
  validate: new SimpleSchema({ _id: ObjectIDSchema }).validator({ keys: ['_id'] }),
  run({ _id }: { _id: Mongo.ObjectID }): void {
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

export const userFoldersInsert = new ValidatedMethod({
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
  run({ name, date }: { name: string; date?: Date }): Mongo.ObjectID {
    // console.log('From user.folders.insert. this.userId:', this.userId);

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
    } as unknown as IFolder) as unknown as Mongo.ObjectID;

    const { folders } = Meteor.users.findOne(this.userId) as IUser;

    Meteor.users.update(this.userId, {
      $set: {
        folders: [folderId, ...folders || []],
      },
    });

    return folderId;
  },
});

export const userFoldersRemove = new ValidatedMethod({
  name: 'user.folders.remove',
  validate: new SimpleSchema({ _id: ObjectIDSchema }).validator({ keys: ['_id'] }),
  run({ _id }: { _id: Mongo.ObjectID }): void {
    if (!this.userId) {
      throw new Meteor.Error(
        'api.user.folders.remove.accessDenied',
        'Cannot remove a folder when not signed in',
      );
    }

    const { folders } = Meteor.users.findOne(this.userId) as IUser;

    if (!folders.map((folderId) => folderId.toHexString()).includes(_id.toHexString())) {
      throw new Meteor.Error(
        'api.user.folders.remove.notFound',
        "Folder does not exist in user's folders",
      );
    }

    const { broadcastOwnerId } = Folders.findOne(_id) || {};

    Folders.remove(_id);
    if (broadcastOwnerId) {
      Broadcasts.remove({ 'addresses.id': broadcastOwnerId });
    }

    Meteor.users.update(this.userId, {
      $set: {
        createdSongs: folders
          .filter((folderId) => folderId.toHexString() !== _id.toHexString()),
      },
    });
  },
});

const USERS_METHODS = [
  userFavoriteToggle,
  userCreatedSongInsert,
  userCreatedSongRemove,
  userFoldersInsert,
  userFoldersRemove,
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
