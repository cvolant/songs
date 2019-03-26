import { Meteor } from 'meteor/meteor';
import React from 'react';
import expect from 'expect';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

import { Editor } from './Editor';
import { notes } from '../fixtures/fixtures';
import { wrap } from 'module';

configure({ adapter: new Adapter() });

if (Meteor.isClient) {
    describe('Editor', function () {
        const meteorCall = expect.createSpy();
        const setSelectedNodeId = expect.createSpy();

        it('should render pick note message', function () {
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNodeId={setSelectedNodeId} />);
            expect(wrapper.find('p').text()).toEqual('Pick or create a note to get started.');
        });
        it('should render no note message', function () {
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNodeId={setSelectedNodeId} selectedNodeId={notes[0]._id} />);
            expect(wrapper.find('p').text()).toEqual('Note not found.');
        });
        it('should remove note', function () {
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNodeId={setSelectedNodeId} selectedNodeId={notes[0]._id} note={notes[0]} />);
            wrapper.find('button').simulate('click');
            expect(meteorCall).toHaveBeenCalledWith('notes.remove', notes[0]._id);
            expect(setSelectedNodeId).toHaveBeenCalledWith(undefined);
        });
        it('should update state and note body on body edit', function () {
            const newBody = 'This is the new body text';
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNodeId={setSelectedNodeId} selectedNodeId={notes[0]._id} note={notes[0]} />);
            wrapper.find('textarea').simulate('change', {
                target: {
                    value: newBody
                }
            });
            expect(wrapper.state('body')).toEqual(newBody);
            expect(meteorCall).toHaveBeenCalledWith('notes.update', notes[0]._id, { body: newBody });
        });
        it('should update state and note title on title edit', function () {
            const newTitle = 'This is the new title text';
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNodeId={setSelectedNodeId} selectedNodeId={notes[0]._id} note={notes[0]} />);
            wrapper.find('input').simulate('change', {
                target: {
                    value: newTitle
                }
            });
            expect(wrapper.state('title')).toEqual(newTitle);
            expect(meteorCall).toHaveBeenCalledWith('notes.update', notes[0]._id, { title: newTitle });
        });
/*         it('should render note title and body', function () {
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNodeId={setSelectedNodeId} selectedNodeId={notes[0]._id} note={notes[0]} />);
            expect(wrapper.find('input').getElements()[0].props.value).toEqual(notes[0].title);
            expect(wrapper.find('textarea').getElements()[0].props.value).toEqual(notes[0].body);
        }); */
        it('should set state for new note', function () {
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNodeId={setSelectedNodeId} />);
            wrapper.setProps({
                selectedNodeId: notes[0]._id,
                note: notes[0]
            });
            expect(wrapper.state('title')).toEqual(notes[0].title);
            expect(wrapper.state('body')).toEqual(notes[0].body);
        });
        it('should not set state if note props not provided', function () {
            wrapper = mount(<Editor meteorCall={meteorCall} setSelectedNodeId={setSelectedNodeId} />);
            wrapper.setProps({
                selectedNodeId: notes[0]._id,
            });
            expect(wrapper.state('title')).toEqual('');
            expect(wrapper.state('body')).toEqual('');
        });

    });
}