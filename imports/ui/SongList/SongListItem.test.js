import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { SongListItem } from './SongListItem';
import { songs } from '../fixtures/fixtures';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('SongListItem', function () {
        let Session;

        beforeEach(() => {
            Session = {
                set: expect.createSpy()
            };
        });
        it('should display song title if exists', function () {
            const wrapper = mount(<SongListItem meteorCall={() => {}} Session={Session} song={songs[0]} />);
            expect(wrapper.find('h5').text()).toEqual(songs[0].title);
        });
        it('should display "Untitled" if title if does not exist', function () {
            const wrapper = mount(<SongListItem meteorCall={() => {}} Session={Session} song={songs[2]} />);
            expect(wrapper.find('h5').text()).toEqual('Untitled song');
        });
        it('should display correct date', function () {
            const wrapper = mount(<SongListItem meteorCall={() => {}} Session={Session} song={songs[0]} />);
            expect(wrapper.find('p').text()).toEqual('Last update : 03/02/2017');
        });
        it('should call set on click', function () {
            const wrapper = mount(<SongListItem meteorCall={() => {}} Session={Session} song={songs[0]} />);
            wrapper.find('div').simulate('click');
            expect(Session.set).toHaveBeenCalledWith('selectedSongId', songs[0]._id);
        });
    });
}