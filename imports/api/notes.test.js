import { Meteor } from 'meteor/meteor';
import expect from 'expect';
import { Notes } from './notes';
import moment from 'moment';

if (Meteor.isServer) {
    describe('notes', function () {
        const note1 = {
            _id: 'testNoteId1',
            title: 'My title',
            body: 'My body for note 1',
            updatedAt: 0,
            userId: 'testUserId1'
        };
        const note2 = {
            _id: 'testNoteId2',
            title: 'My other title',
            body: 'My other body for note 2',
            updatedAt: 0,
            userId: 'testUserId2'
        };
        const newTitle = 'My new title';
        const newBody = 'My new body';

        beforeEach(function () {
            Notes.remove({});
            Notes.insert(note1);
        });

        it('should insert new note', function () {
            const userId = note1.userId;
            const _id = Meteor.server.method_handlers['notes.insert'].apply({ userId });

            expect(Notes.findOne({ _id, userId })).toBeTruthy();
        });

        it('should not insert new note if not authenticated', function () {
            expect(() => {
                Meteor.server.method_handlers['notes.insert']()
            }).toThrow();
        });

        it('should remove note', function () {
            Meteor.server.method_handlers['notes.remove'].apply({ userId: note1.userId }, [note1._id]);
            expect(Notes.findOne({ _id: note1._id })).toBeFalsy();
        });

        it('should not remove note if user is not authenticated', function () {
            expect(() => { Meteor.server.method_handlers['notes.remove'].apply({ userId: '' }, [note1._id]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.remove'].apply({ userId: undefined }, [note1._id]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.remove'].apply({ userId: null }, [note1._id]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.remove'].apply({}, [note1._id]) }).toThrow();
        });

        it('should not remove note if noteId is invalid', function () {
            expect(() => { Meteor.server.method_handlers['notes.remove'].apply({ userId: note1.userId }, ['wrongNoteId']) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.remove'].apply({ userId: note1.userId }, [undefined]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.remove'].apply({ userId: note1.userId }, ['']) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.remove'].apply({ userId: note1.userId }, [{}]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.remove'].apply({ userId: note1.userId }) }).toThrow();
        });

        it('should update note', function () {
            const beforeUpdate = moment().valueOf();
            Meteor.server.method_handlers['notes.update'].apply({ userId: note1.userId }, [note1._id, { title: newTitle, body: newBody }]);
            const updatedNote = Notes.findOne(note1._id);
            expect(updatedNote.title).toEqual(newTitle);
            expect(updatedNote.body).toEqual(newBody);
            expect(updatedNote.updatedAt).toBeGreaterThanOrEqualTo(beforeUpdate);
        });

        it('should not update note if not authenticated', function () {
            expect(() => { Meteor.server.method_handlers['notes.update'].apply({ userId: '' }, [note1._id, { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.update'].apply({ userId: undefined }, [note1._id, { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.update'].apply({ userId: null }, [note1._id, { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.update'].apply({}, [note1._id, { title: newTitle, body: newBody }]) }).toThrow();
        });

        it('should throw an error if extra updates', function () {
            expect(() => {
                Meteor.server.method_handlers['notes.update'].apply({ userId: note1.userId }, [note1._id, { name: 'Bobby' }])
            }).toThrow();
        });

        it('should throw an error if user trying to update is not owner', function () {
            expect(() => {
                Meteor.server.method_handlers['notes.update'].apply({ userId: 'otherUser' }, [note1._id, { title: newTitle, body: newBody }])
            }).toThrow();
        });

        it('should not update note if noteId is invalid', function () {
            expect(() => { Meteor.server.method_handlers['notes.update'].apply({ userId: note1.userId }, [{ title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.update'].apply({ userId: note1.userId }, ['pouet', { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.update'].apply({ userId: note1.userId }, ['', { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.update'].apply({ userId: note1.userId }, [undefined, { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['notes.update'].apply({ userId: note1.userId }, [null, { title: newTitle, body: newBody }]) }).toThrow();
        });

        it('should return a users notes', function () {
            const res = Meteor.server.publish_handlers.notes.apply({userId: note1.userId});
            const notes = res.fetch();
            expect(notes.length).toEqual(1);
            expect(notes[0]).toEqual(note1);
        });

        it('should return no notes for user that has none', function () {
            const res = Meteor.server.publish_handlers.notes.apply({userId: 'anotherUser'});
            const notes = res.fetch();
            expect(notes.length).toEqual(0);
        });

    });
}