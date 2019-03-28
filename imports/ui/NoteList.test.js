import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { NoteList } from './NoteList';
import NoteListItem from './NoteListItem';
import NoteListEmptyItem from './NoteListEmptyItem';
import { notes } from '../fixtures/fixtures';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('NoteList', function () {
        it('should render NoteListItem for each note', function () {
            const wrapper = mount(<NoteList notes={notes} />);
            expect(wrapper.find(NoteListItem).length).toEqual(3);
            expect(wrapper.find(NoteListEmptyItem).length).toEqual(0);
        });
        it('should render NoteListEmptyItem if 0 notes', function () {
            const wrapper = mount(<NoteList notes={[]} />);
            expect(wrapper.find(NoteListItem).length).toEqual(0);
            expect(wrapper.find(NoteListEmptyItem).length).toEqual(1);
        });
    });
}