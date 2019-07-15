import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const Songs = new Mongo.Collection('songs');

// Custom toString function for deep in objects/arrays containing regexp stringing.
const toStr = o => Array.isArray(o) ? '[ ' + o.map(oel => toStr(oel)).join(', ') + ' ]' : o.constructor.name == 'Object' ? '{ ' + Object.entries(o).map(entry => entry[0] + ': ' + toStr(entry[1])).join(', ') + ' }' : o.toString();

if (Meteor.isServer) {
    Meteor.publish('songs', function ({
        search: { globalQuery, specificQueries },
        options: { sort, limit = 20 },
    }) {

        const fields = {
            search: {
                titles: {
                    names: ['titre', 'sousTitre']
                },
                authors: {
                    names: ['auteur', 'compositeur']
                },
                editor: {
                    names: ['editeur']
                },
                classifications: {
                    names: ['cote', 'nouvelleCote']
                },
                lyrics: {
                    names: ['pg.pg']
                },
                before: {
                    names: ['annee'],
                    operator: value => ({ '$lt': parseInt(value) }),
                },
                after: {
                    names: ['annee'],
                    operator: value => ({ '$gt': parseInt(value) }),
                },
                favorites: {
                    names: ['_id'],
                    operator: value => {
                        console.log('From songs, fields.search.favorites.operator. value:', value);
                        const user = Meteor.user();
                        if (user && user.userSongs && user.userSongs.favoriteSongs) {
                            console.log('From songs, fields.search.favorites.operator. Meteor.user().userSongs.favorites:', Meteor.user().userSongs.favoriteSongs);
                            return value == 'no' ? { '$nin': Meteor.user().userSongs.favoriteSongs } : { '$in': Meteor.user().userSongs.favoriteSongs };
                        } else {
                            console.log('From songs, fields.search.favorites.operator. Meteor.user():', Meteor.user());
                            return {};
                        }
                    },
                },
            },
            sortTranslate: sort => {
                const translatedSort = {};
                sort.title && (translatedSort.titre = sort.title);
                sort.author && (translatedSort.auteur = sort.author);
                sort.compositor && (translatedSort.compositeur = sort.compositor);
                sort.year && (translatedSort.annee = sort.year);
                return translatedSort;
            }
        };

        console.log('\n------------------------');
        console.log('\nFrom publish songs, globalQuery =', globalQuery, ', specificQueries =', specificQueries);

        const options = { sort: sort ? fields.sortTranslate(sort) : { annee: -1 }, limit };

        let foundSongs;
        const isThereSpecificQueries = specificQueries && !!specificQueries.length > 0;

        if (!globalQuery && !isThereSpecificQueries) {
            console.log('=> no globalQuery, no specificQueries...');
            foundSongs = Songs.find({}, options);
        } else {
            let queries = [];
            if (isThereSpecificQueries) {
                console.log('=> specificQueries...');

                queries = specificQueries.map(specificQuery => {
                    const query = {};
                    const [[key, value]] = Object.entries(specificQuery);
                    if (!(key in fields.search)) return {};
                    const { names: queryFields, operator } = fields.search[key];
                    const expression = operator ?
                        operator(value) :
                        new RegExp(value, 'i');

                    if (queryFields.length == 1) {
                        query[queryFields[0]] = expression;
                    } else if (queryFields.length > 1) {
                        query['$or'] = queryFields.map(queryField => ({ [queryField]: expression }));
                    }
                    return query;
                });
            }

            if (globalQuery) {
                queries.push({
                    $text: {
                        $search: globalQuery,
                    }
                });
                options.fields = {
                    score: { $meta: "textScore" },
                };
                options.sort.score = { $meta: "textScore" };
            }

            console.log('From songs.\nqueries:', toStr(queries), '\noptions:', toStr(options));

            foundSongs = Songs.find({ '$and': queries }, options);
        }
        return foundSongs;
    });

    Meteor.publish('song', function (_id, options) {
        console.log('From songs, publish song. _id:', _id);
        return Songs.find(_id, options);
    });

}

Meteor.methods({
    'songs.insert'() {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        return Songs.insert({
            title: '',
            body: '',
            userId: this.userId,
            updatedAt: moment().valueOf()
        });
    },

    'songs.remove'(_id) {

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            }
        }).validate({ _id });

        const removal = Songs.remove({ _id: new Meteor.Collection.ObjectID(_id) /* , userId: this.userId */ });
        if (!removal) throw new Meteor.Error(`no song of _id=${_id} found to remove`);
    },

    'songs.update'(_id, updates) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        console.log('From song.update. updates:', updates);

        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            }
        }).validate({
            _id
        });

        songToUpdate = Songs.findOne(new Meteor.Collection.ObjectID(_id));
        console.log('From song.update. songToUpdate:', songToUpdate);
        if (!songToUpdate) {
            throw new Meteor.Error(`no song of _id=${_id} found to update`);
        }

        Songs.update({ _id: songToUpdate._id }, {
            $set: {
                updatedAt: moment().valueOf(),
                ...updates
            }
        });

    },
});