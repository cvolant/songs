import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import {
  IUser, ISearch, IQuery, IQueryOptions, IFieldsKey,
} from '../../../types';

import Songs from '../songs';

type IQueryFields = Record<IFieldsKey, {
  names: string[];
  operator?: (value: string) => Mongo.FieldExpression<
  string | number | Mongo.ObjectID
  > | undefined;
}>;

// Custom toString function for deep in objects/arrays containing regexp stringing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toStr = (o: any): string => {
  if (typeof o === 'undefined') { return '[undefined]'; }
  if (Array.isArray(o)) { return `[ ${o.map((oel) => toStr(oel)).join(', ')} ]`; }
  if (o.constructor.name === 'Object') { return `{ ${Object.entries(o).map((entry) => `${entry[0]}: ${toStr(entry[1])}`).join(', ')} }`; }
  return o.toString();
};

Meteor.publish('song', (_id: Mongo.ObjectID) => {
  console.log('From songs, publish song. _id:', _id);
  return Songs.find(_id);
});

Meteor.publish('songs', ({
  search: { globalQuery, specificQueries } = {},
  options: { sort, limit = 20 } = { limit: 20 },
}: { search: ISearch; options: IQueryOptions }) => {
  const fields: IQueryFields = {
    titles: {
      names: ['title', 'subtitle'],
    },
    authors: {
      names: ['autor', 'compositor'],
    },
    editor: {
      names: ['editor'],
    },
    classifications: {
      names: ['classification', 'newClassification'],
    },
    lyrics: {
      names: ['pg.pg'],
    },
    before: {
      names: ['year'],
      operator: (value): Mongo.FieldExpression<number> => ({ $lt: parseInt(value, 10) }),
    },
    after: {
      names: ['year'],
      operator: (value): Mongo.FieldExpression<number> => ({ $gt: parseInt(value, 10) }),
    },
    favorites: {
      names: ['_id'],
      operator: (value: string): Mongo.FieldExpression<Mongo.ObjectID> | undefined => {
        const user = Meteor.user();
        if (user) {
          console.log('From songs, fields.search.favorites.operator. value:', value);
          const { favoriteSongs } = user as IUser;
          console.log('From songs, fields.search.favorites.operator. value:', value, 'favoritesSongs:', favoriteSongs);
          return value in ['no', 'non'] ? { $nin: favoriteSongs } : { $in: favoriteSongs };
        }
        return undefined;
      },
    },
  };

  console.log('\n------------------------');
  console.log('\nFrom publish songs, globalQuery =', globalQuery, ', specificQueries =', specificQueries);

  const options: IQueryOptions = {
    sort: sort || { year: -1 },
    limit,
  };

  let queries: IQuery[] = [];
  if (specificQueries && specificQueries.length > 0) {
    console.log('=> specificQueries...');

    queries = specificQueries.map((specificQuery) => {
      const query: Mongo.Query<number | string | Mongo.ObjectID> = {};
      const [[key, value]] = Object.entries(specificQuery);
      if (key in fields) {
        const {
          names: queryFields,
          operator,
        } = fields[key as IFieldsKey];
        const expression = operator
          ? operator(value)
          : new RegExp(value, 'i');

        if (typeof expression === 'undefined') {
          return {};
        } if (queryFields.length === 1) {
          query[queryFields[0]] = expression;
        } else if (queryFields.length > 1) {
          query.$or = queryFields.map((queryField) => ({ [queryField]: expression }));
        }
        return query;
      }
      return {};
    });
  }

  if (globalQuery) {
    queries.push({
      $text: {
        $search: globalQuery,
      },
    });
    options.fields = {
      score: { $meta: 'textScore' },
    };
    if (options.sort) options.sort.score = { $meta: 'textScore' };
    else options.sort = { score: { $meta: 'textScore' } };
  }

  const mongoOptions = options as {
    sort?: Mongo.SortSpecifier;
    skip?: number;
    limit?: number;
    fields?: Mongo.FieldSpecifier;
  };
  const foundSongs = queries.length > 0
    ? Songs.find({ $and: queries }, mongoOptions)
    : Songs.find({}, mongoOptions);

  console.log('From songs.\nqueries:', toStr(queries), '\noptions:', toStr(options));
  return foundSongs;
});
