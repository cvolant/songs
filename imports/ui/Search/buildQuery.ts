import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import {
  IUser, ISearch, IQuery, ISong,
} from '../../types';
import { IFieldsKey, IMongoQueryOptions } from '../../types/searchTypes';

type IQueryFields = Record<IFieldsKey, {
  names: string[];
  operator?: (value: string) => Mongo.FieldExpression<
  string | number | Mongo.ObjectID
  > | undefined;
}>;

/*
// Custom toString function for console.log deep in objects/arrays containing regexp stringing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toStr = (o: any): string => {
  if (typeof o === 'undefined') { return '[undefined]'; }
  if (Array.isArray(o)) { return `[ ${o.map((oel) => toStr(oel)).join(', ')} ]`; }
  if (o.constructor.name === 'Object') {
    return `{ ${Object.entries(o).map((entry) => `${entry[0]}: ${toStr(entry[1])}`).join(', ')} }`;
  }
  if (typeof o === 'string') { return `"${o}"`; }
  return o.toString();
};
 */

export const buildQuery = ({
  search: { globalQuery, specificQueries } = {},
  options: propOptions,
}: {
  search?: ISearch;
  options?: IMongoQueryOptions;
}): {
  query: Mongo.Query<ISong>;
  options: IMongoQueryOptions;
} => {
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
      names: ['lyrics.pg'],
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
          // console.log('From songs, fields.search.favorites.operator. value:', value);
          const { favoriteSongs } = user as IUser;
          console.log(
            'From songs, fields.search.favorites.operator.',
            'value:', value,
            'favoritesSongs:', favoriteSongs,
          );
          return value in ['no', 'non'] ? { $nin: favoriteSongs } : { $in: favoriteSongs };
        }
        return undefined;
      },
    },
  };

  /* console.log(
    '\n------------------------',
    '\nFrom buildQuery,',
    'globalQuery =', globalQuery,
    '\nspecificQueries =', specificQueries,
    '\noptions = ', propOptions,
  ); */

  const options: IMongoQueryOptions = propOptions || {};
  if (!options.limit) {
    options.limit = 20;
  }

  let queries: IQuery[] = [];
  if (specificQueries && specificQueries.length > 0) {
    // console.log('=> specificQueries...');

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
      score: { $meta: 'textScore' } as unknown as number,
    };
    if (!options.sort) {
      options.sort = {
        score: { $meta: 'textScore' },
      };
    }
  }

  // console.log('From buildQuery. query:', toStr({ $and: queries }), '\noptions:', toStr(options));

  return {
    query: queries.length > 0 ? { $and: queries } : {},
    options,
  };
};

export default buildQuery;
