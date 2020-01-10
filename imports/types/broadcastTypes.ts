import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import ObjectIDSchema from './collectionTypes';
import { SongSchema, IEditedSong } from './songTypes';

export const BroadcastSchema = new SimpleSchema({
  _id: ObjectIDSchema,
  addresses: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'addresses.$': new SimpleSchema({
    id: String,
    rights: {
      type: String,
      allowedValues: ['readOnly', 'navigate', 'control', 'owner'],
    },
  }),
  songs: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'songs.$': SongSchema,
  state: {
    type: new SimpleSchema({
      blackScreen: {
        type: Boolean,
        optional: true,
      },
      songNumber: {
        type: SimpleSchema.Integer,
        optional: true,
      },
      pgNumber: {
        type: SimpleSchema.Integer,
        optional: true,
      },
    }),
    optional: true,
  },
  status: {
    type: String,
    allowedValues: ['unpublished', 'unstarted', 'ongoing', 'ended'],
    optional: true,
  },
  title: {
    type: String,
    optional: true,
  },
  updatedAt: {
    type: Date,
    defaultValue: new Date(),
    optional: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});

export type IBroadcastRights = 'readOnly' | 'navigate' | 'control' | 'owner';
export interface IBroadcast {
  _id: Mongo.ObjectID;
  addresses: {
    id: string;
    rights: IBroadcastRights;
  }[];
  songs: IEditedSong[];
  state: {
    blackScreen?: boolean;
    songNumber?: number;
    pgNumber?: number;
  };
  status: 'unpublished' | 'unstarted' | 'ongoing' | 'ended';
  title?: string;
  updatedAt: Date;
  userId: string;
}
export default BroadcastSchema;
