import { Meteor } from 'meteor/meteor';
import expect from 'expect';
import { Songs } from './songs';
import moment from 'moment';

if (Meteor.isServer) {
    describe('songs', function () {
        const song1 = {
            _id: 'testSongId1',
            title: 'My title',
            body: 'My body for song 1',
            updatedAt: 0,
            userId: 'testUserId1'
        };
        const song2 = {
            _id: 'testSongId2',
            title: 'My other title',
            body: 'My other body for song 2',
            updatedAt: 0,
            userId: 'testUserId2'
        };
        const newTitle = 'My new title';
        const newBody = 'My new body';

        beforeEach(function () {
            Songs.remove({});
            Songs.insert(song1);
        });

        it('should insert new song', function () {
            const userId = song1.userId;
            const _id = Meteor.server.method_handlers['songs.insert'].apply({ userId });

            expect(Songs.findOne({ _id, userId })).toBeTruthy();
        });

        it('should not insert new song if not authenticated', function () {
            expect(() => {
                Meteor.server.method_handlers['songs.insert']()
            }).toThrow();
        });

        it('should remove song', function () {
            Meteor.server.method_handlers['songs.remove'].apply({ userId: song1.userId }, [song1._id]);
            expect(Songs.findOne({ _id: song1._id })).toBeFalsy();
        });

        it('should not remove song if user is not authenticated', function () {
            expect(() => { Meteor.server.method_handlers['songs.remove'].apply({ userId: '' }, [song1._id]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.remove'].apply({ userId: undefined }, [song1._id]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.remove'].apply({ userId: null }, [song1._id]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.remove'].apply({}, [song1._id]) }).toThrow();
        });

        it('should not remove song if songId is invalid', function () {
            expect(() => { Meteor.server.method_handlers['songs.remove'].apply({ userId: song1.userId }, ['wrongSongId']) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.remove'].apply({ userId: song1.userId }, [undefined]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.remove'].apply({ userId: song1.userId }, ['']) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.remove'].apply({ userId: song1.userId }, [{}]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.remove'].apply({ userId: song1.userId }) }).toThrow();
        });

        it('should update song', function () {
            const beforeUpdate = moment().valueOf();
            Meteor.server.method_handlers['songs.update'].apply({ userId: song1.userId }, [song1._id, { title: newTitle, body: newBody }]);
            const updatedSong = Songs.findOne(song1._id);
            expect(updatedSong.title).toEqual(newTitle);
            expect(updatedSong.body).toEqual(newBody);
            expect(updatedSong.updatedAt).toBeGreaterThanOrEqualTo(beforeUpdate);
        });

        it('should not update song if not authenticated', function () {
            expect(() => { Meteor.server.method_handlers['songs.update'].apply({ userId: '' }, [song1._id, { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.update'].apply({ userId: undefined }, [song1._id, { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.update'].apply({ userId: null }, [song1._id, { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.update'].apply({}, [song1._id, { title: newTitle, body: newBody }]) }).toThrow();
        });

        it('should throw an error if extra updates', function () {
            expect(() => {
                Meteor.server.method_handlers['songs.update'].apply({ userId: song1.userId }, [song1._id, { name: 'Bobby' }])
            }).toThrow();
        });

        it('should throw an error if user trying to update is not owner', function () {
            expect(() => {
                Meteor.server.method_handlers['songs.update'].apply({ userId: 'otherUser' }, [song1._id, { title: newTitle, body: newBody }])
            }).toThrow();
        });

        it('should not update song if songId is invalid', function () {
            expect(() => { Meteor.server.method_handlers['songs.update'].apply({ userId: song1.userId }, [{ title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.update'].apply({ userId: song1.userId }, ['pouet', { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.update'].apply({ userId: song1.userId }, ['', { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.update'].apply({ userId: song1.userId }, [undefined, { title: newTitle, body: newBody }]) }).toThrow();
            expect(() => { Meteor.server.method_handlers['songs.update'].apply({ userId: song1.userId }, [null, { title: newTitle, body: newBody }]) }).toThrow();
        });

        it('should return a users songs', function () {
            const res = Meteor.server.publish_handlers.songs.apply({userId: song1.userId});
            const songs = res.fetch();
            expect(songs.length).toEqual(1);
            expect(songs[0]).toEqual(song1);
        });

        it('should return no songs for user that has none', function () {
            const res = Meteor.server.publish_handlers.songs.apply({userId: 'anotherUser'});
            const songs = res.fetch();
            expect(songs.length).toEqual(0);
        });

    });
}