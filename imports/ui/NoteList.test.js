import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import { NoteList } from './NoteList';
import NoteListItem from './NoteListItem';
import NoteListEmptyItem from './NoteListEmptyItem';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('NoteList', function () {
        const notes = [
            {
                _id: 'note1Id',
                title: 'note1Title',
                body: 'note1Body',
                updateAt: 0,
                userId: 'note1UserId'
            },
            {
                _id: 'note2Id',
                title: 'note2Title',
                body: 'note2Body',
                updateAt: 0,
                userId: 'note2UserId'
            }
        ];
        it('should render NoteListItem for each note', function () {
            const wrapper = mount(<NoteList notes={notes} />);
            expect(wrapper.find(NoteListItem).length).toEqual(2);
            expect(wrapper.find(NoteListEmptyItem).length).toEqual(0);
        });
        it('should render NoteListEmptyItem if 0 notes', function () {
            const wrapper = mount(<NoteList notes={[]} />);
            expect(wrapper.find(NoteListItem).length).toEqual(0);
            expect(wrapper.find(NoteListEmptyItem).length).toEqual(1);
        });
    });
}