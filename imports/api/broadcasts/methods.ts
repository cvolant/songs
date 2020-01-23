import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import { Broadcasts } from './broadcasts';

import {
  BroadcastSchema,
  IBroadcast,
  IBroadcastUpdates,
} from '../../types/broadcastTypes';
import { ObjectIDSchema } from '../../types';
import { SongSchema, IEditedSong } from '../../types/songTypes';

export const broadcastInsert = new ValidatedMethod({
  name: 'broadcast.insert',
  validate: (BroadcastSchema.pick('addresses', 'addresses.$') as SimpleSchema).validator(),
  run({ addresses }: { addresses: IBroadcast['addresses']; }): boolean {
    if (!this.userId) {
      throw new Meteor.Error(
        'broadcast.insert.notLoggedIn',
        'Must be logged in to create a broadcast',
      );
    }

    return !!Broadcasts.insert({
      addresses,
      songs: [],
      state: {},
      status: 'unpublished',
      updatedAt: new Date(),
      userId: this.userId,
    });
  },
});

export const broadcastUpdate = new ValidatedMethod({
  name: 'broadcast.update',
  validate: new SimpleSchema({
    _id: ObjectIDSchema,
    updates: BroadcastSchema.pick('state', 'status') as SimpleSchema,
    viewerId: String,
  }).validator(),
  run({ _id, updates, viewerId }: {
    _id: Mongo.ObjectID;
    updates: IBroadcastUpdates;
    viewerId: string;
  }): void {
    console.log('From api.broadcast.update, viewerId:', viewerId);

    const broadcast = Broadcasts.findOne({
      addresses: {
        $elemMatch: {
          id: viewerId,
          rights: 'owner',
        },
      },
    });

    if (!broadcast) {
      throw new Meteor.Error(
        'broadcast.getAddresses.notFound',
        'Owned broadcast not found',
      );
    }

    console.log('From api.broadcast.update.accessGranted. updates:', updates);

    Broadcasts.update(_id, {
      $set: { ...updates },
    });
  },
});

export const broadcastUpdateAddRemoveSong = new ValidatedMethod({
  name: 'broadcast.update.addRemoveSong',
  validate: new SimpleSchema({
    _id: ObjectIDSchema,
    operation: {
      type: String,
      allowedValues: ['add', 'remove'],
    },
    song: SongSchema,
    viewerId: String,
  }).validator(),
  run({
    _id,
    operation,
    song,
    viewerId,
  }: {
    _id: Mongo.ObjectID;
    operation: 'add' | 'remove';
    song: IEditedSong;
    viewerId: string;
  }): void {
    console.log('From api.broadcast.update.addRemoveSong, viewerId:', viewerId);

    const broadcast = Broadcasts.findOne({
      addresses: {
        $elemMatch: {
          id: viewerId,
          rights: 'owner',
        },
      },
    });

    if (!broadcast) {
      throw new Meteor.Error(
        'broadcast.getAddresses.notFound',
        'Owned broadcast not found',
      );
    }

    const modifier = {} as Mongo.Modifier<IBroadcast>;

    if (operation === 'add') {
      modifier.$addToSet = { songs: song };
    } else {
      modifier.$pull = { songs: { _id: song._id } };

      const songIndex = broadcast.songs
        .map((mapSong) => mapSong._id.toHexString())
        .indexOf(song._id.toHexString());

      const songNumber = broadcast.state && broadcast.state.songNumber;

      if (songNumber && songIndex <= songNumber) {
        modifier.$inc = { 'state.songNumber': -1 };
      }
    }

    Broadcasts.update(_id, modifier);
  },
});

export const broadcastGetAddresses = new ValidatedMethod({
  name: 'broadcast.getAddresses',
  validate: new SimpleSchema({
    broadcastOwnerId: String,
  }).validator(),
  run({ broadcastOwnerId }: { broadcastOwnerId: string }): IBroadcast['addresses'] {
    const broadcast = Broadcasts.findOne({
      addresses: {
        $elemMatch: {
          id: broadcastOwnerId,
          rights: 'owner',
        },
      },
    });

    if (!broadcast) {
      throw new Meteor.Error(
        'broadcast.getAddresses.notFound',
        'Owned broadcast not found',
      );
    }

    return broadcast.addresses;
  },
});

const BROADCASTS_METHODS = [
  broadcastInsert,
  broadcastUpdate,
  broadcastUpdateAddRemoveSong,
  broadcastGetAddresses,
].map((method) => method.name);

if (Meteor.isServer) {
  // Only allow 5 broadcasts operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return (BROADCASTS_METHODS as string[]).includes(name);
    },

    // Rate limit per connection ID
    connectionId() { return true; },
  }, 5, 1000);
}
