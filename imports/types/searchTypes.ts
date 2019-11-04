import { Mongo } from 'meteor/mongo';

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
