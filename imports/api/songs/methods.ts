import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import Songs from './songs';
import { userCreatedSongInsert, userCreatedSongRemove } from '../users/methods';
import slugify from '../../utils/slugify';

import { IUser, ObjectIDSchema, IUnfetched } from '../../types';
import { ISong, SongSchema } from '../../types/songTypes';

const findExistingSlug = (
  s: string,
  songId?: Mongo.ObjectID,
): ISong | undefined => Songs.findOne({
  ...songId ? { _id: { $ne: songId } } : {},
  slug: s,
});

const updateSlug = (song: Partial<ISong> & { title: string }): string => {
  const slugAuthor = song.compositor || song.author;

  const baseSlug = `${slugAuthor ? `${slugify(slugAuthor)}/` : ''}${slugify(song.title)}`;
  let slug = baseSlug;
  let nbExisting = 1;
  let existing = findExistingSlug(slug, song._id);

  while (existing && nbExisting < 50) {
    nbExisting += 1;
    slug = `${baseSlug}-${nbExisting}`;
    existing = findExistingSlug(slug, song._id);
  }

  return slug;
};

export const songsInsert = new ValidatedMethod({
  name: 'songs.insert',
  validate: SongSchema.validator(),
  run(song: Mongo.OptionalId<Partial<ISong> & { title: string }>): Mongo.ObjectID {
    if (!this.userId) {
      throw new Meteor.Error(
        'api.user.createdSongs.insert.accessDenied',
        'Cannot create a song when not signed in',
      );
    }

    const slug = updateSlug(song);

    const newSong = {
      slug,
      userId: this.userId,
      ...song,
    };
    const songId = Songs.insert(newSong) as unknown as Mongo.ObjectID;

    userCreatedSongInsert.call(songId);

    return songId;
  },
});

export const songsUpdate = new ValidatedMethod({
  name: 'songs.update',
  validate: SongSchema.validator(),
  run(requestedUpdates: IUnfetched<ISong>): void {
    if (!this.userId) {
      throw new Meteor.Error(
        'api.songs.insert.accessDenied',
        'Cannot update a song when not signed in',
      );
    }

    const song = Songs.findOne(requestedUpdates._id);

    if (!song) {
      throw new Meteor.Error(
        'api.songs.update.notFound',
        'Song not found',
      );
    }

    if (song.userId !== this.userId) {
      throw new Meteor.Error(
        'api.songs.update.accessDenied',
        'Cannot update a song that is not yours',
      );
    }

    const updatesToPerform: Partial<ISong> = ([
      'number',
      'author',
      'classification',
      'cnpl',
      'compositor',
      'editor',
      'lyrics',
      'newClassification',
      'slug',
      'subtitle',
      'title',
      'traductor',
      'year',
    ] as Array<keyof ISong>).reduce((result, key) => ({
      ...result,
      [key]: requestedUpdates[key],
    }), {});

    if (!updatesToPerform.slug && (
      updatesToPerform.title
      || updatesToPerform.compositor
      || updatesToPerform.author
    )) {
      updatesToPerform.slug = updateSlug({
        ...song,
        ...updatesToPerform,
      });
    }

    Songs.update(song._id, {
      $set: {
        ...updatesToPerform,
      },
    });
  },
});

export const songsRemove = new ValidatedMethod({
  name: 'songs.remove',
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

    userCreatedSongRemove.call(_id);
  },
});

const SONGS_METHODS = [
  songsInsert,
  songsUpdate,
  songsRemove,
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
