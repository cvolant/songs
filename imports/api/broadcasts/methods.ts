import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import { Broadcasts } from './broadcasts';

import { BroadcastSchema, IBroadcast } from '../../types/broadcastTypes';
import { ObjectIDSchema } from '../../types';

export const broadcastUpdate = new ValidatedMethod({
  name: 'broadcast.update',
  validate: new SimpleSchema({
    _id: ObjectIDSchema,
    updates: BroadcastSchema.pick('state', 'status') as SimpleSchema,
    viewerId: String,
  }).validator(),
  run({
    _id,
    updates,
    viewerId,
  }: {
    _id: Mongo.ObjectID;
    updates: {
      state?: IBroadcast['state'];
      status?: IBroadcast['status'];
    };
    viewerId: string;
  }): void {
    const broadcast = Broadcasts.findOne(_id);

    if (broadcast) {
      if (viewerId && !broadcast.addresses
        .find((address) => (address.rights === 'control' || address.rights === 'owner') && address.id === viewerId)) {
        console.log('From api.broadcast.update.accessDenied, viewerId:', viewerId, 'broadcast:', broadcast);
        throw new Meteor.Error(
          'broadcast.update.accessDenied',
          'Cannot update a broadcast when you do not have control or owner rights',
        );
      }

      console.log('From api.broadcast.update.accessGranted, updates:', updates, 'broadcast:', broadcast);

      Broadcasts.update(_id, {
        $set: { ...updates },
      });
    }
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
  broadcastUpdate,
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
