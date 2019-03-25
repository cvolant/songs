import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import moment from 'moment';

import { NoteListItem } from './NoteListItem';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('NoteListItem', function () {
        const testNote1 = {
            title: 'Test note title',
            _id: 'testNoteId1',
            body: 'Test note body',
            updatedAt: 1486137505429
        };
        const testNote2 = {
            title: '',
            _id: 'testNoteId2',
            body: '',
            updatedAt: moment().valueOf()
        };
        it('should display note title if exists', function () {
            const wrapper = mount(<NoteListItem meteorCall={() => {}} note={testNote1} />);
            expect(wrapper.find('h5').text()).toEqual(testNote1.title);
        });
        it('should display "Untitled" if title if does not exist', function () {
            const wrapper = mount(<NoteListItem meteorCall={() => {}} note={testNote2} />);
            expect(wrapper.find('h5').text()).toEqual('Untitled note');
        });
        it('should display correct date', function () {
            const wrapper = mount(<NoteListItem meteorCall={() => {}} note={testNote1} />);
            expect(wrapper.find('p').text()).toEqual('Last update : 03/02/2017');
        });
    });
}