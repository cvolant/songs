import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { IEditedSong, SongSchema } from './songTypes';
import ObjectIDSchema from './collectionTypes';

export const FolderSchema = new SimpleSchema({
  _id: ObjectIDSchema,
  broadcastOwnerId: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
    max: 100,
    optional: true,
  },
  date: {
    type: Date,
    optional: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  sharedWith: {
    type: Array,
    defaultValue: [],
    optional: true,
  },
  'sharedWith.$': String,
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
export interface IFolder {
  _id: Mongo.ObjectID;
  broadcastOwnerId?: string;
  date?: Date;
  name: string;
  sharedWith: string[];
  songs: IEditedSong[];
  userId: string;
  updatedAt: Date;
}
export default FolderSchema;
