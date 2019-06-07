import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const Songs = new Mongo.Collection('songs');

if (Meteor.isServer) {
    Meteor.publish('songs', function ({ globalQuery, specificQueries }) {

        const defaultFields = ['title', 'body'];
        
        console.log('\n------------------------');
        console.log('\nFrom publish songs, globalQuery =', globalQuery, ', specificQueries =', specificQueries);

        let foundSongs;
        const isThereSpecificQueries = specificQueries ? Object.keys(specificQueries).length > 0 : false;

        if (!globalQuery && !isThereSpecificQueries) {
            console.log('=> no globalQuery, no specificQueries...');
            foundSongs = Songs.find({}, { sort: { annee: -1 }, limit: 50 });
            debugger;
        } else if (isThereSpecificQueries) {
            console.log('=> specificQueries...');
            
            let queries = [specificQueries];

            if(globalQuery) {
                const orQueries = defaultFields.map(defaultField => {
                    const orQuery = {};
                    orQuery[defaultField] = new RegExp(globalQuery, 'i');
                    return orQuery;
                });
                queries.push({ '$or': orQueries });
            }

            foundSongs = Songs.find({ '$and': queries }, { sort: { annee: -1 }, limit: 50 });

        } else {
            console.log('=> globalQuery without specificQueries...');
            foundSongs = Songs.find(
                {
                    userId: this.userId,
                    $text: {
                        $search: globalQuery,
                    },
                },
                {
                    fields: {
                        score: { $meta: "textScore" },
                    },
                    sort: {
                        score: { $meta: "textScore" },
                        annee: -1,
                    },
                    limit: 50
                }
            );
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