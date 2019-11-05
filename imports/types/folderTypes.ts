import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { IEditedSong, SongSchema } from './songTypes';
import { ISortSpecifierValue } from './searchTypes';
import ObjectIDSchema from './collectionTypes';

export const FolderSchema = new SimpleSchema({
  _id: ObjectIDSchema,
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  name: {
    type: String,
    max: 100,
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
  date?: Date;
  name: string;
  sharedWith: string[];
  songs: IEditedSong[];
  userId: string;
  updatedAt: Date;
}
export type ISortFolderCriterion = 'name' | 'date' | 'updatedAd';
export type ISortFolderSpecifier = Record<ISortFolderCriterion, ISortSpecifierValue>;
export interface IUnfetchedFolder extends Partial<IFolder> {
  _id: Mongo.ObjectID;
}
export default FolderSchema;
