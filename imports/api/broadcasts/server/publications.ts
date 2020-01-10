import { Mongo } from 'meteor/mongo';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { Broadcasts } from '../broadcasts';
import { IBroadcast, ISong } from '../../../types';
import Songs from '../../songs/songs';

publishComposite('broadcast', (broadcastId: string) => ({
  find(this: { userId: string }): Mongo.Cursor<IBroadcast> {
    return Broadcasts.find(
      { 'addresses.id': broadcastId },
      {
        fields: {
          addresses: { $elemMatch: { id: broadcastId } },
          songs: 1,
          state: 1,
          status: 1,
          title: 1,
        } as unknown as Mongo.FieldSpecifier,
      },
    );
  },

  children: [{
    find(broadcast: IBroadcast): Mongo.Cursor<ISong> {
      return Songs.find({ _id: { $in: broadcast.songs.map((song) => song._id) } });
    },
  }],
}));
