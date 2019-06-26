import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const Songs = new Mongo.Collection('songs');

if (Meteor.isServer) {
    Meteor.publish('songs', function ({ globalQuery, specificQueries }) {

        const fields = {
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
            before: {
                names: ['annee'],
                operator: '$lt'
            },
            after: {
                names: ['annee'],
                operator: '$gt'
            },
        };

        console.log('\n------------------------');
        console.log('\nFrom publish songs, globalQuery =', globalQuery, ', specificQueries =', specificQueries);

        let foundSongs;
        const isThereSpecificQueries = specificQueries ? Object.keys(specificQueries).length > 0 : false;

        if (!globalQuery && !isThereSpecificQueries) {
            console.log('=> no globalQuery, no specificQueries...');
            foundSongs = Songs.find({}, { sort: { annee: -1 }, limit: 20 });
            debugger;
        } else {
            let queries = [];
            if (isThereSpecificQueries) {
                console.log('=> specificQueries...');

                queries = Object.entries(specificQueries).map(entry => {
                    const specificQuery = {};
                    const key = entry[0];
                    const { names: queryFields, operator } = fields[key];
                    const expression = operator ?
                        { [operator]: parseInt(entry[1]) } :
                        new RegExp(entry[1], 'i');

                    if (queryFields.length == 1) {
                        specificQuery[queryFields[0]] = expression;
                    } else if (queryFields.length > 1) {
                        specificQuery['$or'] = queryFields.map(queryField => ({ [queryField]: expression }));
                    }
                    return specificQuery;
                });
            }

            let options = { sort: {}, limit: 20 };

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
            options.sort.annee = -1;

            console.log('From songs.\nqueries:', queries, 'options:', options);

            foundSongs = Songs.find({ '$and': queries }, options);
        }
        return foundSongs;
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
        /* 
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        */
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