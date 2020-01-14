import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import Songs from './songs';

import { ISong, SongSchema } from '../../types/songTypes';

/*
export const insert = new ValidatedMethod({
  name: 'songs.insert',
  validate: new SimpleSchema({
    song: SongSchema,
  }).validator(),
  run(this: IMethodInvocation, { song }: { song: ISong }): void {
    if (!this.userId) {
      throw new Meteor.Error(
        'api.songs.insert.accessDenied',
        'Cannot create a song when not signed in',
      );
    }

    const newSong = {
      userId: this.userId,
      updatedAt: new Date(),
      ...song,
    };

    const songId = Songs.insert(newSong);

    console.log('From songs.insert. songId:', songId);
  },
});
 */
export const songsUpdate = new ValidatedMethod({
  name: 'songs.update',
  validate: new SimpleSchema({
    songUpdates: SongSchema,
  }).validator(),
  run({ songUpdates }: { songUpdates: ISong }): void {
    if (!this.userId) {
      throw new Meteor.Error(
        'api.songs.insert.accessDenied',
        'Cannot update a song when not signed in',
      );
    }

    const song = Songs.findOne(songUpdates._id);

    if (song) {
      if (song.userId !== this.userId) {
        throw new Meteor.Error(
          'api.songs.update.accessDenied',
          'Cannot update a song that is not yours',
        );
      }

      Songs.update(song._id, {
        $set: {
          ...songUpdates,
          userId: song.userId,
        },
      });
    }
  },
});

export default songsUpdate;
/*
export const remove = new ValidatedMethod({
  name: 'songs.remove',
  validate: new SimpleSchema({
    songId: String,
  }).validator(),
  run(this: IMethodInvocation, { songId }: { songId: Mongo.ObjectID }): void {
    if (!this.userId) {
      throw new Meteor.Error(
        'api.songs.remove.accessDenied',
        'Cannot remove a song when not signed in',
      );
    }

    const song = Songs.findOne({ _id: songId });

    if (!song) {
      console.log('From songs.remove.run. song NOT found. songId:', songId);
      throw new Meteor.Error(
        'api.songs.remove.not-found',
        'Cannot remove a song that does not exist',
      );
    }
    console.log('From songs.remove.run. song found. songId:', songId);

    if (song.userId !== this.userId) {
      throw new Meteor.Error(
        'api.songs.remove.accessDenied',
        'Cannot remove a song that is not yours',
      );
    }

    Songs.remove(songId);
  },
});
 */
const SONGS_METHODS = [
  // insert,
  songsUpdate,
  // remove,
].map((method) => method.name);

if (Meteor.isServer) {
  // Only allow 5 songs operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return (SONGS_METHODS as string[]).includes(name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
