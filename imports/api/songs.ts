/* eslint-disable func-names */
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import { ISearch, ISearchOptions, ISearchOptionSort } from '../ui/SongList/SearchField';
import { IUser } from './users';
import { IParagraph } from '../ui/Editor/Paragraph';

export interface ISong {
  _id: Mongo.ObjectID;
  auteur?: string;
  cnpl?: boolean;
  cote?: string;
  compositeur?: string;
  editeur?: string;
  traducteur?: string;
  nouvelleCote?: string;
  numero?: number;
  annee?: number;
  sousTitre?: string;
  titre?: string;
  pg?: IParagraph[];
}
interface ISortSpecifier extends Mongo.SortSpecifier {
  score?: {
    $meta: string;
  };
}
interface IFieldSpecifier {
  score?: {
    $meta: string;
  };
}
interface IQuery {
  [key: string]: string | number | IQuery | IQuery[];
}
interface IQueryOptions {
  sort?: ISortSpecifier;
  skip?: number;
  limit?: number;
  fields?: IFieldSpecifier;
  reactive?: boolean;
  transform?: Function | null;
}
/*
{
  sort?: IQuery;
  limit?: number;
  fields?: IQuery;
  score?: IQuery;
}
 */
type IFieldsKey =
| 'titles'
| 'authors'
| 'editor'
| 'classifications'
| 'lyrics'
| 'before'
| 'after'
| 'favorites';

interface IFields {
  search: Record<IFieldsKey, {
    names: string[];
    operator?: (value: string) => Mongo.FieldExpression<string | number | Mongo.ObjectID>;
  }>;
  sortTranslate: (sortToTranlate: ISearchOptionSort) => IQuery;
}

export const Songs = new Mongo.Collection('songs');

// Custom toString function for deep in objects/arrays containing regexp stringing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toStr = (o: any): string => {
  if (typeof o === 'undefined') { return '[undefined]'; }
  if (Array.isArray(o)) { return `[ ${o.map((oel) => toStr(oel)).join(', ')} ]`; }
  if (o.constructor.name === 'Object') { return `{ ${Object.entries(o).map((entry) => `${entry[0]}: ${toStr(entry[1])}`).join(', ')} }`; }
  return o.toString();
};

if (Meteor.isServer) {
  Meteor.publish('songs', ({
    search: { globalQuery, specificQueries } = {},
    options: { sort, limit = 20 } = { limit: 20 },
  }: { search: ISearch; options: ISearchOptions }) => {
    const fields: IFields = {
      search: {
        titles: {
          names: ['titre', 'sousTitre'],
        },
        authors: {
          names: ['auteur', 'compositeur'],
        },
        editor: {
          names: ['editeur'],
        },
        classifications: {
          names: ['cote', 'nouvelleCote'],
        },
        lyrics: {
          names: ['pg.pg'],
        },
        before: {
          names: ['annee'],
          operator: (value): Mongo.FieldExpression<number> => ({ $lt: parseInt(value, 10) }),
        },
        after: {
          names: ['annee'],
          operator: (value): Mongo.FieldExpression<number> => ({ $gt: parseInt(value, 10) }),
        },
        favorites: {
          names: ['_id'],
          operator: (value: string): Mongo.FieldExpression<Mongo.ObjectID> => {
            console.log('From songs, fields.search.favorites.operator. value:', value);
            const user = Meteor.user() as IUser;
            console.log('From songs, fields.search.favorites.operator. value:', value, 'Meteor.user().userSongs.favorites:', user.userSongs.favoriteSongs);
            return value in ['no', 'non'] ? { $nin: user.userSongs.favoriteSongs } : { $in: user.userSongs.favoriteSongs };
          },
        },
      },
      sortTranslate: (sortToTranlate) => {
        const translatedSort = {} as IQuery;
        if (sortToTranlate.title) { translatedSort.titre = sortToTranlate.title; }
        if (sortToTranlate.author) { translatedSort.auteur = sortToTranlate.author; }
        if (sortToTranlate.compositor) { translatedSort.compositeur = sortToTranlate.compositor; }
        if (sortToTranlate.year) { translatedSort.annee = sortToTranlate.year; }
        return translatedSort;
      },
    };

    console.log('\n------------------------');
    console.log('\nFrom publish songs, globalQuery =', globalQuery, ', specificQueries =', specificQueries);

    const options: IQueryOptions = {
      sort: sort ? fields.sortTranslate(sort) : { annee: -1 },
      limit,
    };

    let queries: IQuery[] = [];
    if (specificQueries && specificQueries.length > 0) {
      console.log('=> specificQueries...');

      queries = specificQueries.map((specificQuery) => {
        const query: Mongo.Query<number | string | Mongo.ObjectID> = {};
        const [[key, value]] = Object.entries(specificQuery);
        if (key in fields.search) {
          const {
            names: queryFields,
            operator,
          } = fields.search[key as IFieldsKey];
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

    const foundSongs = queries.length > 0
      ? Songs.find({ $and: queries }, options)
      : Songs.find({}, options);

    console.log('From songs.\nqueries:', toStr(queries), '\noptions:', toStr(options), '\nfoundSongs:', foundSongs);
    return foundSongs;
  });

  Meteor.publish('song', (_id, options) => {
    console.log('From songs, publish song. _id:', _id);
    return Songs.find(_id, options);
  });
}

Meteor.methods({
  'songs.insert': function () {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    return Songs.insert({
      title: '',
      body: '',
      userId: this.userId,
      updatedAt: moment().valueOf(),
    });
  },

  'songs.remove': function (_id) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    new SimpleSchema({
      _id: {
        type: String,
        min: 1,
      },
    }).validate({ _id });

    const removal = Songs.remove({ _id: new Meteor.Collection.ObjectID(_id) });
    if (!removal) throw new Meteor.Error(`no song of _id=${_id} found to remove`);
  },

  'songs.update': function (_id, updates) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    console.log('From song.update. updates:', updates);

    new SimpleSchema({
      _id: {
        type: String,
        min: 1,
      },
    }).validate({
      _id,
    });

    const songToUpdate = Songs.findOne(new Meteor.Collection.ObjectID(_id)) as ISong;
    console.log('From song.update. songToUpdate:', songToUpdate);
    if (!songToUpdate) {
      throw new Meteor.Error(`no song of _id=${_id} found to update`);
    }

    Songs.update({ _id: songToUpdate._id }, {
      $set: {
        updatedAt: moment().valueOf(),
        ...updates,
      },
    });
  },
});

export default Songs;
