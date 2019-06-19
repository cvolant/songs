import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { SongList } from '.';
import SongListItem from './SongListItem';
import SongListEmptyItem from './SongListEmptyItem';
import { songs } from '../fixtures/fixtures';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('SongList', function () {
        it('should render SongListItem for each song', function () {
            const wrapper = mount(<SongList songs={songs} />);
            expect(wrapper.find(SongListItem).length).toEqual(3);
            expect(wrapper.find(SongListEmptyItem).length).toEqual(0);
        });
        it('should render SongListEmptyItem if 0 songs', function () {
            const wrapper = mount(<SongList songs={[]} />);
            expect(wrapper.find(SongListItem).length).toEqual(0);
            expect(wrapper.find(SongListEmptyItem).length).toEqual(1);
        });
    });
}