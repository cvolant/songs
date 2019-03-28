import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import { NoteListItem } from './NoteListItem';
import { notes } from '../fixtures/fixtures';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('NoteListItem', function () {
        let Session;

        beforeEach(() => {
            Session = {
                set: expect.createSpy()
            };
        });
        it('should display note title if exists', function () {
            const wrapper = mount(<NoteListItem meteorCall={() => {}} Session={Session} note={notes[0]} />);
            expect(wrapper.find('h5').text()).toEqual(notes[0].title);
        });
        it('should display "Untitled" if title if does not exist', function () {
            const wrapper = mount(<NoteListItem meteorCall={() => {}} Session={Session} note={notes[2]} />);
            expect(wrapper.find('h5').text()).toEqual('Untitled note');
        });
        it('should display correct date', function () {
            const wrapper = mount(<NoteListItem meteorCall={() => {}} Session={Session} note={notes[0]} />);
            expect(wrapper.find('p').text()).toEqual('Last update : 03/02/2017');
        });
        it('should call set on click', function () {
            const wrapper = mount(<NoteListItem meteorCall={() => {}} Session={Session} note={notes[0]} />);
            wrapper.find('div').simulate('click');
            expect(Session.set).toHaveBeenCalledWith('selectedNoteId', notes[0]._id);
        });
    });
}