import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import ObjectIDSchema from './collectionTypes';
import { SongSchema, IEditedSong } from './songTypes';

export const BroadcastSchema = new SimpleSchema({
  _id: ObjectIDSchema,
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  songs: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'songs.$': SongSchema,
  updatedAt: {
    type: Date,
    defaultValue: new Date(),
    optional: true,
  },
});
export interface IBroadcast {
  _id: Mongo.ObjectID;
  songs: IEditedSong[];
  userId: string;
  updatedAt: Date;
}
export default BroadcastSchema;
