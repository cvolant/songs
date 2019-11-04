import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { IEditedSong, SongSchema } from './songTypes';
import { ISortSpecifierValue } from './searchTypes';

export const FolderSchema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    max: 100,
  },
  sharedWith: {
    type: Array,
    defaultValue: [],
  },
  'sharedWith.$': String,
  songs: {
    type: Array,
    defaultValue: [],
  },
  'songs.$': SongSchema,
  updatedAt: {
    type: Date,
    defaultValue: new Date(),
  },
});
export interface IFolder {
  _id: Mongo.ObjectID;
  date?: Date;
  name: string;
  sharedWith: string[];
  songs: IEditedSong[];
  userId: string;
  updatedAt: Date;
}
export type ISortFolderCriterion = 'name' | 'date' | 'updatedAd';
export type ISortFolderSpecifier = Record<ISortFolderCriterion, ISortSpecifierValue>;

export default FolderSchema;
