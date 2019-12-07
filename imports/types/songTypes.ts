import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import ObjectIDSchema from './collectionTypes';

const ParagraphSchema = new SimpleSchema({
  label: String,
  pg: String,
  index: SimpleSchema.Integer,
});
export interface IParagraph {
  label: string;
  pg: string;
  index: number;
}
const PgStateSchema = new SimpleSchema({
  pgIndex: SimpleSchema.Integer,
  selected: Boolean,
  edit: Boolean,
});
export interface IPgState {
  [key: string]: number | boolean;
  pgIndex: number;
  selected: boolean;
  edit: boolean;
}
const SongSchema = new SimpleSchema({
  _id: {
    type: ObjectIDSchema,
    optional: true,
  },
  author: {
    type: String,
    optional: true,
  },
  cnpl: {
    type: Boolean,
    optional: true,
  },
  classification: {
    type: String,
    optional: true,
  },
  compositor: {
    type: String,
    optional: true,
  },
  editor: {
    type: String,
    optional: true,
  },
  traductor: {
    type: String,
    optional: true,
  },
  newClassification: {
    type: String,
    optional: true,
  },
  number: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  year: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  subtitle: {
    type: String,
    optional: true,
  },
  title: {
    type: String,
    optional: true,
  },
  lyrics: {
    type: Array,
    optional: true,
  },
  'lyrics.$': ParagraphSchema,
  updatedAt: {
    type: Date,
    optional: true,
  },
  userId: {
    type: String,
    optional: true,
  },
  pgStates: {
    type: PgStateSchema,
    optional: true,
  },
});
export interface ISong {
  _id: Mongo.ObjectID;
  author?: string;
  cnpl?: boolean;
  classification?: string;
  compositor?: string;
  editor?: string;
  traductor?: string;
  newClassification?: string;
  number?: number;
  year?: number;
  subtitle?: string;
  title: string;
  lyrics?: IParagraph[];
  updatedAt?: Date;
  userId?: string;
}
export interface IEditedSong extends Partial<ISong> {
  _id: Mongo.ObjectID;
  pgStates?: IPgState[];
}
export interface IUnfetchedSong extends Partial<ISong> {
  _id: Mongo.ObjectID;
}

export {
  ParagraphSchema,
  PgStateSchema,
  SongSchema,
};
