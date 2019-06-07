import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Editor } from './Editor';
import { songs } from '../fixtures/fixtures';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('Editor', () => {
        let meteorCall;
        let setSelectedSongId;

        beforeEach(() => {
            meteorCall = expect.createSpy();
            setSelectedSongId = expect.createSpy();
        });

        it('should render pick song message', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedSongId={setSelectedSongId} classes={{}} />);
            expect(wrapper.find('p').text()).toEqual('Pick or create a song to get started.');
        });
        it('should render no song message', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedSongId={setSelectedSongId} selectedSongId={songs[0]._id} classes={{}} />);
            expect(wrapper.find('p').text()).toEqual('Song not found.');
        });
        it('should remove song', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedSongId={setSelectedSongId} selectedSongId={songs[0]._id} song={songs[0]} classes={{}} />);
            wrapper.find('button').simulate('click');
            expect(meteorCall).toHaveBeenCalledWith('songs.remove', songs[0]._id);
            expect(setSelectedSongId).toHaveBeenCalledWith(undefined);
        });
        it('should update state and song body on body edit', function () {
            const newBody = 'This is the new body text';
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedSongId={setSelectedSongId} selectedSongId={songs[0]._id} song={songs[0]} classes={{}} />);
            debugger;
            wrapper.find('[placeholder="Your song here"]').simulate('change', {
                target: {
                    value: newBody
                }
            });
            expect(wrapper.state('body')).toEqual(newBody);
            expect(meteorCall).toHaveBeenCalledWith('songs.update', songs[0]._id, { body: newBody });
        });
        it('should update state and song title on title edit', function () {
            const newTitle = 'This is the new title text';
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedSongId={setSelectedSongId} selectedSongId={songs[0]._id} song={songs[0]} classes={{}} />);
            wrapper.find('input').simulate('change', {
                target: {
                    value: newTitle
                }
            });
            expect(wrapper.state('title')).toEqual(newTitle);
            expect(meteorCall).toHaveBeenCalledWith('songs.update', songs[0]._id, { title: newTitle });
        });
/*         it('should render song title and body', function () {
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedSongId={setSelectedSongId} selectedSongId={songs[0]._id} song={songs[0]} />);
            expect(wrapper.find('input').getElements()[0].props.value).toEqual(songs[0].title);
            expect(wrapper.find('textarea').getElements()[0].props.value).toEqual(songs[0].body);
        }); */
        it('should set state for new song', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedSongId={setSelectedSongId} classes={{}} />);
            wrapper.setProps({
                selectedSongId: songs[0]._id,
                song: songs[0]
            });
            expect(wrapper.state('title')).toEqual(songs[0].title);
            expect(wrapper.state('body')).toEqual(songs[0].body);
        });
        it('should not set state if song props not provided', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedSongId={setSelectedSongId} classes={{}} />);
            wrapper.setProps({
                selectedSongId: songs[0]._id,
            });
            expect(wrapper.state('title')).toEqual('');
            expect(wrapper.state('body')).toEqual('');
        });

    });
}