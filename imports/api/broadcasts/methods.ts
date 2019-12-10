import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Broadcasts } from './broadcasts';

import { IMethodInvocation, IUnfetched } from '../../types/collectionTypes';
import { BroadcastSchema, IBroadcast } from '../../types/broadcastTypes';

export const broadcastsUpdate = new ValidatedMethod({
  name: 'broadcasts.update',
  validate: BroadcastSchema.validator(),
  run(this: IMethodInvocation, broadcastUpdates: IUnfetched<IBroadcast>): void {
    const broadcast = Broadcasts.findOne(broadcastUpdates._id);

    if (broadcast) {
      if (broadcast.userId !== this.userId) {
        throw new Meteor.Error(
          'api.broadcasts.update.newSong.accessDenied',
          'Cannot update a broadcast that is not yours',
        );
      }

      Broadcasts.update(broadcastUpdates._id, {
        $set: { ...broadcastUpdates },
      });
    }
  },
});

export default broadcastsUpdate;

const BROADCASTS_METHODS = [
  broadcastsUpdate,
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
