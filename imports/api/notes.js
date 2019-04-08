import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

export const Notes = new Mongo.Collection('notes');

if (Meteor.isServer) {
    Meteor.publish('notes', function ({ globalQuery, specificQueries }) {

        const defaultFields = ['title', 'body'];
        
        console.log('\n-----------------------');
        console.log('\nFrom publish notes, globalQuery =', globalQuery, ', specificQueries =', specificQueries);

        let foundNotes;
        const isThereSpecificQueries = specificQueries ? Object.keys(specificQueries).length > 0 : false;

        if (!globalQuery && !isThereSpecificQueries) {
            console.log('=> no globalQuery, no specificQueries...');
            foundNotes = Notes.find({ userId: this.userId });
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

            foundNotes = Notes.find({
                userId: this.userId,
                '$and': queries
            });

        } else {
            console.log('=> globalQuery without specificQueries...');
            foundNotes = Notes.find(
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
                    },
                }
            );
        }
        return foundNotes;
    });
}

Meteor.methods({
    'notes.insert'() {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        return Notes.insert({
            title: '',
            body: '',
            userId: this.userId,
            updatedAt: moment().valueOf()
        });
    },

    'notes.remove'(_id) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            }
        }).validate({ _id });

        const removal = Notes.remove({ _id, userId: this.userId });
        if (!removal) throw new Meteor.Error(`no note of _id=${_id} found to remove`);
    },

    'notes.update'(_id, updates) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            },
            title: {
                type: String,
                optional: true
            },
            body: {
                type: String,
                optional: true
            }
        }).validate({
            _id,
            ...updates
        });

        noteToUpdate = Notes.findOne(_id);

        if (!noteToUpdate) {
            throw new Meteor.Error(`no note of _id=${_id} found to update`);
        }
        else if (noteToUpdate.userId !== this.userId) {
            throw new Meteor.Error('must be the owner to update');
        }

        Notes.update({ _id, userId: this.userId }, {
            $set: {
                updatedAt: moment().valueOf(),
                ...updates
            }
        });

    },

    'notes.filtre'(search) {
        searchQuery = search;
        console.log('From notes.filtre, searchQuery =', searchQuery);
    }
});