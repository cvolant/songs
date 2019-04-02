import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Editor } from './Editor';
import { notes } from '../fixtures/fixtures';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('Editor', () => {
        let meteorCall;
        let setSelectedNoteId;

        beforeEach(() => {
            meteorCall = expect.createSpy();
            setSelectedNoteId = expect.createSpy();
        });

        it('should render pick note message', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNoteId={setSelectedNoteId} classes={{}} />);
            expect(wrapper.find('p').text()).toEqual('Pick or create a note to get started.');
        });
        it('should render no note message', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNoteId={setSelectedNoteId} selectedNoteId={notes[0]._id} classes={{}} />);
            expect(wrapper.find('p').text()).toEqual('Note not found.');
        });
        it('should remove note', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNoteId={setSelectedNoteId} selectedNoteId={notes[0]._id} note={notes[0]} classes={{}} />);
            wrapper.find('button').simulate('click');
            expect(meteorCall).toHaveBeenCalledWith('notes.remove', notes[0]._id);
            expect(setSelectedNoteId).toHaveBeenCalledWith(undefined);
        });
        it('should update state and note body on body edit', function () {
            const newBody = 'This is the new body text';
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNoteId={setSelectedNoteId} selectedNoteId={notes[0]._id} note={notes[0]} classes={{}} />);
            debugger;
            wrapper.find('[placeholder="Your note here"]').simulate('change', {
                target: {
                    value: newBody
                }
            });
            expect(wrapper.state('body')).toEqual(newBody);
            expect(meteorCall).toHaveBeenCalledWith('notes.update', notes[0]._id, { body: newBody });
        });
        it('should update state and note title on title edit', function () {
            const newTitle = 'This is the new title text';
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNoteId={setSelectedNoteId} selectedNoteId={notes[0]._id} note={notes[0]} classes={{}} />);
            wrapper.find('input').simulate('change', {
                target: {
                    value: newTitle
                }
            });
            expect(wrapper.state('title')).toEqual(newTitle);
            expect(meteorCall).toHaveBeenCalledWith('notes.update', notes[0]._id, { title: newTitle });
        });
/*         it('should render note title and body', function () {
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNoteId={setSelectedNoteId} selectedNoteId={notes[0]._id} note={notes[0]} />);
            expect(wrapper.find('input').getElements()[0].props.value).toEqual(notes[0].title);
            expect(wrapper.find('textarea').getElements()[0].props.value).toEqual(notes[0].body);
        }); */
        it('should set state for new note', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNoteId={setSelectedNoteId} classes={{}} />);
            wrapper.setProps({
                selectedNoteId: notes[0]._id,
                note: notes[0]
            });
            expect(wrapper.state('title')).toEqual(notes[0].title);
            expect(wrapper.state('body')).toEqual(notes[0].body);
        });
        it('should not set state if note props not provided', function () {
            const wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNoteId={setSelectedNoteId} classes={{}} />);
            wrapper.setProps({
                selectedNoteId: notes[0]._id,
            });
            expect(wrapper.state('title')).toEqual('');
            expect(wrapper.state('body')).toEqual('');
        });

    });
}