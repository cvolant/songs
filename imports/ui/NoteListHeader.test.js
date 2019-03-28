import {Meteor} from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import {NoteListHeader} from './NoteListHeader';
import {notes} from '../fixtures/fixtures';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('NoteListHeader', function () {
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
            const wrapper = mount(<NoteListHeader meteorCall={meteorCall} Session={Session}  />);
            wrapper.find('button').simulate('click');
            meteorCall.calls[0].arguments[1](undefined, notes[0]._id);
            expect(meteorCall.calls[0].arguments[0]).toEqual('notes.insert');
            expect(Session.set).toHaveBeenCalledWith('selectedNoteId', notes[0]._id);
        });
        it('should not set Session for failed inserts', function () {
            const spy = expect.createSpy();
            const wrapper = mount(<NoteListHeader meteorCall={meteorCall} Session={Session}  />);
            wrapper.find('button').simulate('click');
            meteorCall.calls[0].arguments[1]({ reason: 'Parce que, mais parce queeeeee !'}, undefined);
            expect(meteorCall.calls[0].arguments[0]).toEqual('notes.insert');
            expect(Session.set).toNotHaveBeenCalled();
        });
    });
}