import {Meteor} from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import {NoteListHeader} from './NoteListHeader';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('NoteListHeader', function () {
        it('should call meteorCall on a button click', function () {
            const spy = expect.createSpy();
            const wrapper = mount(<NoteListHeader meteorCall={spy} />);
            wrapper.find('button').simulate('click');
            expect(spy).toHaveBeenCalledWith('notes.insert');
        });
    });
}