import {Meteor} from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {SongListHeader} from './SongListHeader';
import {songs} from '../fixtures/fixtures';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('SongListHeader', function () {
        let meteorCall;
        let Session;

        beforeEach(function () {
            meteorCall = expect.createSpy();
            Session = {
                set: expect.createSpy()
            };
        });
        it('should call meteorCall on a button click', function () {
            const spy = expect.createSpy();
            const wrapper = mount(<SongListHeader meteorCall={meteorCall} Session={Session}  />);
            wrapper.find('button').simulate('click');
            meteorCall.calls[0].arguments[1](undefined, songs[0]._id);
            expect(meteorCall.calls[0].arguments[0]).toEqual('songs.insert');
            expect(Session.set).toHaveBeenCalledWith('selectedSongId', songs[0]._id);
        });
        it('should not set Session for failed inserts', function () {
            const spy = expect.createSpy();
            const wrapper = mount(<SongListHeader meteorCall={meteorCall} Session={Session}  />);
            wrapper.find('button').simulate('click');
            meteorCall.calls[0].arguments[1]({ reason: 'Parce que, mais parce queeeeee !'}, undefined);
            expect(meteorCall.calls[0].arguments[0]).toEqual('songs.insert');
            expect(Session.set).toNotHaveBeenCalled();
        });
    });
}