
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { DDPCommon } from 'meteor/ddp';

const ObjectIDSchema = new SimpleSchema({ _str: String });

// /////////////// //
//      Song       //
// /////////////// //
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
  pg: {
    type: Array,
    optional: true,
  },
  'pg.$': ParagraphSchema,
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
  pg?: IParagraph[];
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

// /////////////// //
//     Folder      //
// /////////////// //
const FolderSchema = new SimpleSchema({
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


// /////////////// //
//      User       //
// /////////////// //
export interface IUser extends Meteor.User {
  favoriteSongs: Mongo.ObjectID[];
  folders: Mongo.ObjectID[];
  createdSongs: Mongo.ObjectID[];
  emails: Meteor.UserEmail[];
}


// /////////////// //
//     Search      //
// /////////////// //
export type IFieldsKey =
| 'titles'
| 'authors'
| 'editor'
| 'classifications'
| 'lyrics'
| 'before'
| 'after'
| 'favorites';
export type ISpecificQuery = Record<string, string>;
export interface ISearch {
  globalQuery?: string;
  specificQueries?: ISpecificQuery[];
}
export type ISortSpecifierValue = 1 | -1 | undefined | {
  $meta: string;
};
export type ISortCriterion = 'title' | 'compositor' | 'author' | 'year';
export interface ISortSpecifier extends Record<ISortCriterion, ISortSpecifierValue> {
  score?: {
    $meta: string;
  };
}
export interface IFieldSpecifier {
  score?: {
    $meta: string;
  };
}
export interface IQuery {
  [key: string]: string | number | IQuery | IQuery[];
}
export interface IQueryOptions {
  sort?: ISortSpecifier;
  skip?: number;
  limit?: number;
  fields?: IFieldSpecifier;
}
export interface IMongoQueryOptions {
  sort?: Mongo.SortSpecifier;
  skip?: number;
  limit?: number;
  fields?: Mongo.FieldSpecifier;
}


// /////////////// //
//     Utils       //
// /////////////// //
export interface IMethodInvocation extends DDPCommon.MethodInvocation {
  userId?: string;
}

export {
  ObjectIDSchema,
  ParagraphSchema,
  PgStateSchema,
  SongSchema,
  FolderSchema,
};
