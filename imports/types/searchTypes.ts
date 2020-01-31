import { Mongo } from 'meteor/mongo';
import { ISong } from './songTypes';
import { IFolder } from './folderTypes';

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
export type ISortCriterion<T extends ISong | IFolder> = string & keyof T;
export type ISortSpecifier<
  T extends ISong | IFolder
> = Record<ISortCriterion<T>, ISortSpecifierValue> & {
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
export interface IQueryOptions<T extends ISong | IFolder> {
  sort?: ISortSpecifier<T>;
  skip?: number;
  limit?: number;
  fields?: IFieldSpecifier;
}
export interface IMongoQueryOptions {
  sort?: Mongo.SortSpecifier;
  skip?: number;
  limit?: number;
  fields?: Mongo.FieldSpecifier;
  transform?: (doc: object) => object;
}
