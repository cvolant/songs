import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import { Folders } from './folders';

import { IMethodInvocation, ObjectIDSchema } from '../../types/collectionTypes';
import { ISong, SongSchema } from '../../types/songTypes';
import { FolderSchema, IUnfetchedFolder } from '../../types/folderTypes';

export const foldersUpdate = new ValidatedMethod({
  name: 'folders.update',
  validate: FolderSchema.validator(),
  run(this: IMethodInvocation, folderUpdates: IUnfetchedFolder): void {
    const folder = Folders.findOne(folderUpdates._id);

    if (folder) {
      if (folder.userId !== this.userId) {
        throw new Meteor.Error(
          'api.folders.update.newSong.accessDenied',
          'Cannot update a folder that is not yours',
        );
      }

      Folders.update(folderUpdates._id, {
        $set: { ...folderUpdates },
      });
    }
  },
});

export const foldersUpdateSongsInsert = new ValidatedMethod({
  name: 'folders.songs.insert',
  validate: new SimpleSchema({
    folderId: ObjectIDSchema,
    songId: ObjectIDSchema,
  }).validator(),
  run(this: IMethodInvocation, { folderId, songId }: {
    folderId: Mongo.ObjectID;
    songId: Mongo.ObjectID;
  }): void {
    const folder = Folders.findOne(folderId, { fields: { userId: 1, songs: 1 } });

    if (folder) {
      if (folder.userId !== this.userId) {
        console.log('From folders.songs.insert. folder.userId !== this.userId... Folders:', Folders, 'folder:', folder, 'folder.userId:', folder.userId, 'this.userId:', this.userId);
        throw new Meteor.Error(
          'api.folders.update.newSong.accessDenied',
          'Cannot add songs in a folder that is not yours',
        );
      }

      const { songs } = folder;
      Folders.update(folderId, {
        $set: {
          songs: [{ _id: songId }, ...songs],
          updatedAt: new Date(),
        },
      });

      console.log('From folders.songs.insert. song inserted.');
    }
  },
});

export const foldersUpdateSongsUpdate = new ValidatedMethod({
  name: 'folders.songs.update',
  validate: new SimpleSchema({
    folderId: ObjectIDSchema,
    songUpdates: SongSchema,
  }).validator(),
  run(this: IMethodInvocation, { folderId, songUpdates }: {
    folderId: string;
    songUpdates: ISong;
  }): void {
    const folder = Folders.findOne(folderId);

    if (folder) {
      if (folder.userId !== this.userId) {
        throw new Meteor.Error(
          'api.folders.update.newSong.accessDenied',
          'Cannot add songs in a folder that is not yours',
        );
      }

      const { songs } = folder;
      const song = {
        ...songs.splice(songs
          .map((songInSongs) => songInSongs._id.toHexString())
          .indexOf(songUpdates._id.toHexString())),
        ...songUpdates,
      };

      Folders.update(folderId, {
        $set: { songs: [song, ...songs] },
      });
    }
  },
});

export const foldersUpdateSongsRemove = new ValidatedMethod({
  name: 'folders.songs.remove',
  validate: new SimpleSchema({
    folderId: ObjectIDSchema,
    songId: ObjectIDSchema,
  }).validator(),
  run(this: IMethodInvocation, { folderId, songId }: {
    folderId: Mongo.ObjectID;
    songId: Mongo.ObjectID;
  }): void {
    const folder = Folders.findOne(folderId);

    if (folder) {
      if (folder.userId !== this.userId) {
        throw new Meteor.Error(
          'api.folders.update.removeSong.accessDenied',
          'Cannot remove songs in a folder that is not yours',
        );
      }

      const { songs } = folder;
      const newSongs = songs.filter((song) => song._id.toHexString() !== songId.toHexString());
      console.log('From folders.update.removeSong. newSongs:', newSongs);
      Folders.update(folderId, {
        $set: { songs: newSongs },
      });
    }
  },
});

const FOLDERS_METHODS = [
  foldersUpdate,
  foldersUpdateSongsInsert,
  foldersUpdateSongsUpdate,
  foldersUpdateSongsRemove,
].map((method) => method.name);

if (Meteor.isServer) {
  // Only allow 5 folders operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return (FOLDERS_METHODS as string[]).includes(name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
